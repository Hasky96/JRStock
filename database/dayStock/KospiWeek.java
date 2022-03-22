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

public class KospiWeek {

	public static void main(String[] args) throws IOException, ParseException {
//		"code_number","Name","Market","Dept","Close",	// 0~4
//		"ChangeCode","Changes","ChagesRatio","Open","High","Low",	// 5~10
//		"Volume","Amount","Marcap","Stocks","MarketId","Rank","Date"	// 11~17
		StringBuilder sb=new StringBuilder();
		BufferedReader br;
		int idx=0;
		int n=10000;
		String[][] total=new String[n][];
		String[][] arr=new String[n][13];
		System.setIn(new FileInputStream("C:/ssafy/project2/data/day_stock/kosdaq_day.txt"));
		br=new BufferedReader(new InputStreamReader(System.in));
//		br.readLine();
		while(true) {
			String str=br.readLine();
			if (str==null) {
				break;
			}
			total[idx++]=str.split(",");
		}
		
	
		System.out.println("input end");
		
//		stock_seq, `code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,
//		`low_price`, `volume`,`trade_price`,`market_cap`,`stock_amount`,`date`
		int beforeDate=10;
		String weekDate=null;
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
		int k=0;
		for (int i=0; i<idx; i++) {
			String[] cur=total[i];
			String dateStr=cur[12];
			int year=Integer.parseInt(dateStr.split("-")[0]);
			int month=Integer.parseInt(dateStr.split("-")[1]);
			int day=Integer.parseInt(dateStr.split("-")[2]);
			LocalDate date = LocalDate.of(year, month, day);
			int curDate = date.getDayOfWeek().getValue();
			
			if (beforeDate>curDate) {	// 일주일의 시작
				arr[k][1]=cur[0];
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
				arr[k][12]=weekDate;
				k++;
//				System.out.println(i+": "+Arrays.toString(arr[i]));
//					System.out.println(cur[0]);
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
			weekDate=cur[12];
			double beforeEnd=end;
//			System.out.println(i+" ");
			if (k!=0) {
//				System.out.println(Arrays.toString(arr[i-1]));
//				System.out.println(arr[i-1][2]);
				beforeEnd=Double.parseDouble(arr[k-1][2]);
			}
//			if (beforeEnd==0) {
//				beforeEnd=end;
//			}
			changes=end-beforeEnd;
			changeRatio=(int)(10000*changes/beforeEnd)/100.0;
			
			beforeDate=curDate;
		}
		
		System.out.println("save");
//		int k=0;
		for (int i=0; i<k; i++) {
			if (i%3640==0) {
				sb.append("insert into week_stock (`code_number`,`current_price`,`changes`,`chages_ratio`,`start_price`,`high_price`,`low_price`,`volume`,`trade_price`,`market_cap`,`stock_amount`,`date`) VALUES ");
			}
			sb.append("(\"kosdaq\",");
			for (int j=2; j<12; j++) {
				sb.append(arr[i][j]).append(",");
			}
			sb.append("\"").append(arr[i][12]).append("\")");
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
			bs = new BufferedOutputStream(new FileOutputStream("C:/ssafy/project2/data/day_stock/kosdaq_week.sql"));
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
