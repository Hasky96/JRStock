import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class DayStock2022 {

	public static void main(String[] args) throws IOException {
//		"code_number","Name","Market","Dept","Close","ChangeCode","Changes","ChagesRatio","Open","High","Low",
//		"Volume","Amount","Marcap","Stocks","MarketId","Rank","Date"
		for (int y=1995; y<=2022; y++) {
			System.setIn(new FileInputStream("C:/ssafy/project2/data/marcap/data/marcap-"+y+".csv/marcap-"+y+".csv"));
			BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
			br.readLine();
			int n=800000;
			String[][] arr=new String[n][17];
			StringBuilder sb=new StringBuilder();
			int count=0;
			for (int i=0; i<n; i++) {
				String str=br.readLine();
				if (str==null) {
					break;
				}
				arr[i]=str.split(",");
				count++;
			}
			
			for (int i=0; i<count; i++) {
				if (i%3640==0) {
					sb.append("insert into day_stock (`code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,`low_price`,`volume`,`trade_price`,`market_cap`,`stock_amount`,`date`) VALUES ");
				}
				sb.append("(")
				.append(arr[i][0]).append(",")
				.append((int)Double.parseDouble(arr[i][4])).append(",")
				.append((int)Double.parseDouble(arr[i][6])).append(",")
				.append(arr[i][7]).append(",")
				.append((int)Double.parseDouble(arr[i][8])).append(",")
				.append((int)Double.parseDouble(arr[i][9])).append(",")
				.append((int)Double.parseDouble(arr[i][10])).append(",")
				.append((long)Double.parseDouble(arr[i][11])).append(",")
				.append((long)Double.parseDouble(arr[i][12])).append(",")
				.append((long)Double.parseDouble(arr[i][13])).append(",")
				.append((long)Double.parseDouble(arr[i][14])).append(",")
				.append(arr[i][17])
				.append(")");
				if (i%3640==3639) {
					sb.append(";\n");
				} else {
					sb.append(",\n");
				}
			}
			
			String result=sb.substring(0, sb.length()-2)+";";
			
			BufferedOutputStream bs = null;
			try {
				bs = new BufferedOutputStream(new FileOutputStream("C:/ssafy/project2/data/day_stock/"+y+".sql"));
				bs.write(result.getBytes()); //Byte형으로만 넣을 수 있음
	
			} catch (Exception e) {
		                e.getStackTrace();
				// TODO: handle exception
			}finally {
				bs.close();
			}
			
			br.close();
			
			System.out.println(y+" end");
		}
	}

}
