import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

public class KospiMonth {

	public static void main(String[] args) throws IOException, ParseException {
		System.setIn(new FileInputStream("C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/week_kospi_kosdaq.txt"));
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
		StringBuilder sb=new StringBuilder();
//		br.readLine();
//		int beforeDate=10;
//		String weekDate=null;
		String[][] arr=new String[5000000][13];
		String beforeStock="000000";
		int[] days={0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
		int k=0;
		int beforeMonth=0;
		double start=0.0;
		double end=0.0;
		double high=0.0;
		double low=10000000.0;
		long volume=0l;
		long tradePrice=0l;
		long marketCap=0l;
		long stockAmount=0l;
		double changes=0.0;
		double changeRatio=0.0;
		String beforeDate="";
//		arr=new String[5000000][13];
		while(true) {
			String str=br.readLine();
			if (str==null) {
				break;
			}
			String[] cur=str.split(",");
			String dateStr=cur[12];
			
			if (!beforeStock.equals(cur[1])) {
//				arr=new String[5000000][13];
				beforeMonth=0;
//				System.out.println(k+" "+cur[1]);
			}

			int year=Integer.parseInt(dateStr.split("-")[0]);
			int month=Integer.parseInt(dateStr.split("-")[1]);
			if (month!=beforeMonth) {
				arr[k][1]=beforeStock;
				arr[k][2]=(int)(100*end)/100.0+"";
				arr[k][3]=(int)(100*changes)/100.0+"";
				arr[k][4]=changeRatio+"";
				arr[k][5]=(int)(100*start)/100.0+"";
				arr[k][6]=(int)(100*high)/100.0+"";
				arr[k][7]=(int)(100*low)/100.0+"";
				arr[k][8]=volume+"";
				arr[k][9]=tradePrice+"";
				arr[k][10]=marketCap+"";
				arr[k][11]=stockAmount+"";
				arr[k][12]=beforeDate;
				k++;

				beforeStock=cur[1];
				start=Double.parseDouble(cur[5]);
				high=Double.parseDouble(cur[6]);
				low=Double.parseDouble(cur[7]);
				volume=(long)Double.parseDouble(cur[8]);
				tradePrice=(long)Double.parseDouble(cur[9]);
			} else {
				high=Math.max(high, Double.parseDouble(cur[6]));
				low=Math.min(low, Double.parseDouble(cur[7]));
				volume+=(long)Double.parseDouble(cur[8]);
				tradePrice+=(long)Double.parseDouble(cur[9]);
			}
			end=Double.parseDouble(cur[2]);	// 일주일의 마지막 날로 최종 업데이트
			marketCap=(long)Double.parseDouble(cur[10]);
			stockAmount=(long)Double.parseDouble(cur[11]);
//			weekDate=cur[17];
			double beforeEnd=Double.parseDouble(arr[k-1][2]);
			if (beforeEnd==0) {
				beforeEnd=end;
			}
			changes=end-beforeEnd;
			changeRatio=(int)(10000*changes/beforeEnd)/100.0;
			
			beforeMonth=month;
//			beforeDate=year+"-"+month+"-"+days[month];
			beforeDate=cur[12];
//			k++;
			
		}		
	
		System.out.println("input end");
		
//		stock_seq `code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,
//		`low_price`, `volume`,`trade_price`,`market_cap`,`stock_amount`,`date`
		
		
		System.out.println("save");
		System.out.println(k);
//		int t=0;
		for (int i=0; i<k; i++) {
			if (i%3640==0) {
				sb.append("insert into month_stock (`code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,`low_price`,`volume`,`trade_price`,`market_cap`,`stock_amount`,`date`) VALUES ");
			}
//			System.out.println(i);
			sb.append("(\"")
			.append(arr[i][1]).append("\",")
			.append(arr[i][2]).append(",")
			.append(arr[i][3]).append(",")
			.append(arr[i][4]).append(",")
			.append(arr[i][5]).append(",")
			.append(arr[i][6]).append(",")
			.append(arr[i][7]).append(",")
			.append(arr[i][8]).append(",")
			.append(arr[i][9]).append(",")
			.append(arr[i][10]).append(",")
			.append(arr[i][11]).append(",\"")
			.append(arr[i][12]).append("\")");
			if (i%3640==3639) {
				sb.append(";\n");
			} else {
				sb.append(",\n");
			}
//			k++;
			
		}
		
		String result=sb.substring(0, sb.length()-2)+";";
//		System.out.println(result);
		BufferedOutputStream bs = null;
		try {
//			bs = new BufferedOutputStream(new FileOutputStream("C:/ssafy/project2/data/day_stock/week_stock"+Y+".sql"));
			bs = new BufferedOutputStream(new FileOutputStream("C:/ssafy/project2/data/month_kospi_kosdaq.sql"));
			bs.write(result.getBytes()); //Byte형으로만 넣을 수 있음

		} catch (Exception e) {
	                e.getStackTrace();
			// TODO: handle exception
		}finally {
			bs.close();
		}
		
		System.out.println("end");
		
	}

}
