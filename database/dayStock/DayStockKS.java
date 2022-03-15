import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

public class DayStockKS {

	public static void main(String[] args) throws IOException {
//		"code_number","Name","Market","Dept","Close","ChangeCode","Changes","ChagesRatio","Open","High","Low",
//		"Volume","Amount","Marcap","Stocks","MarketId","Rank","Date"
		StringBuilder sb=new StringBuilder();
		BufferedReader br=null;
		long[][][][] total=new long[27][13][32][4];
		int n=800000;
		for (int y=1996; y<=2022; y++) {
			System.setIn(new FileInputStream("C:/ssafy/project2/data/marcap/data/marcap-"+y+".csv/marcap-"+y+".csv"));
			br=new BufferedReader(new InputStreamReader(System.in));
			br.readLine();
			int count=0;
			String[][] arr=new String[n][17];
			for (int i=0; i<n; i++) {
				String str=br.readLine();
				if (str==null) {
					break;
				}
				arr[i]=str.split(",");
				count++;
			}
//			System.out.println(arr[0][17].split("\"")[1]);
			for (int i=0; i<count; i++) {
				if (!arr[i][2].equals("\"KOSDAQ\"")) {
					continue;
				}
				int year=Integer.parseInt(arr[i][17].split("\"")[1].split("-")[0]);
				int month=Integer.parseInt(arr[i][17].split("\"")[1].split("-")[1]);
				int day=Integer.parseInt(arr[i][17].split("\"")[1].split("-")[2]);
				total[year-1996][month][day][0]+=(long)(Double.parseDouble(arr[i][11]));
				total[year-1996][month][day][1]+=(long)(Double.parseDouble(arr[i][12]));
				total[year-1996][month][day][2]+=(long)(Double.parseDouble(arr[i][13]));
				total[year-1996][month][day][3]+=(long)(Double.parseDouble(arr[i][14]));
			}
			System.out.println(y);
		}
		System.out.println("start");
		System.setIn(new FileInputStream("C:/ssafy/project2/data/KQ11.csv"));
		br=new BufferedReader(new InputStreamReader(System.in));
		System.out.println(br.readLine());
		int count=0;
		String[][] arr=new String[n][7];
		for (int i=0; i<n; i++) {
			String str=br.readLine();
			if (str==null) {
				break;
			}
			arr[i]=str.split(",");
			count++;
		}
		System.out.println(count);
		int index=1;
		for (int i=1; i<count; i++) {
			if ("null".equals(arr[i][1])) {
				index++;
				continue;
			} 
//			System.out.println(Arrays.toString(arr[i]));
			int year=Integer.parseInt(arr[i][0].split("-")[0]);
			int month=Integer.parseInt(arr[i][0].split("-")[1]);
			int day=Integer.parseInt(arr[i][0].split("-")[2]);
			double changes=Double.parseDouble(arr[i][4])-Double.parseDouble(arr[i-index][4]);
			double changeRatio=changes/Double.parseDouble(arr[i-index][4]);
			changes=(double)Math.round(changes*100)/100;
			changeRatio=(double)Math.round(changeRatio*10000)/100;
			if (i==1 || i%3640==0) {
				sb.append("insert into day_stock (`code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,`low_price`,`volume`,`trade_price`,`market_cap`,`stock_amount`,`date`) VALUES ");
			}
			sb.append("(")
			.append("\"kosdaq\"").append(",")
			.append(arr[i][4]).append(",")
			.append(changes).append(",")
			.append(changeRatio).append(",")
			.append(arr[i][1]).append(",")
			.append(arr[i][2]).append(",")
			.append(arr[i][3]).append(",")
			.append(total[year-1996][month][day][0]).append(",")
			.append(total[year-1996][month][day][1]).append(",")
			.append(total[year-1996][month][day][2]).append(",")
			.append(total[year-1996][month][day][3]).append(",")
			.append("\"").append(arr[i][0]).append("\"").append(")");
			if (i%3640==3639) {
				sb.append(";\n");
			} else {
				sb.append(",\n");
			}
			index=1;
		}
			
		String result=sb.substring(0, sb.length()-2)+";";
		
		BufferedOutputStream bs = null;
		try {
			bs = new BufferedOutputStream(new FileOutputStream("C:/ssafy/project2/data/day_stock/kosdaq.sql"));
			bs.write(result.getBytes()); //Byte형으로만 넣을 수 있음

		} catch (Exception e) {
	                e.getStackTrace();
			// TODO: handle exception
		}finally {
			bs.close();
		}
		
		br.close();
	}

}
