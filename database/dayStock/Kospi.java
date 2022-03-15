import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class Kospi {

	public static void main(String[] args) throws IOException {
		//current_price,volume,trade_price,date,start_price,high_price,low_price
		System.setIn(new FileInputStream("C:/ssafy/project2/data/KS11.csv"));
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
		int n=6217;
		String[][] arr=new String[n][7];
		String[] str=new String[n];
		StringBuilder sb=new StringBuilder();
		for (int i=0; i<n; i++) {
			str[i]=br.readLine();
			arr[i]=str[i].split(",");
		}
		sb.append("insert into day_stock (`code_number`,`current_price`,`volume`,`trade_price`,`date`,`start_price`,`high_price`,`low_price`,`changes`,`chages_ratio`) VALUES").append("\n");
		sb.append("(kopsi,").append(str[0]).append(",0.0,0,0),");
		for (int i=1; i<n; i++) {
			double changes=Double.parseDouble(arr[i][0])-Double.parseDouble(arr[i-1][0]);
			double changeRatio=changes/Double.parseDouble(arr[i-1][0]);
			changes=(double)Math.round(changes*100)/100;
			changeRatio=(double)Math.round(changeRatio*100)/100;
			sb.append("(kopsi,").append(str[i]).append(",").append(changes).append(",").append(changeRatio).append("),").append("\n");
		}
		
		BufferedOutputStream bs = null;
		try {
			bs = new BufferedOutputStream(new FileOutputStream("C:/ssafy/project2/data/kospi.sql"));
			bs.write(sb.toString().getBytes()); //Byte형으로만 넣을 수 있음

		} catch (Exception e) {
	                e.getStackTrace();
			// TODO: handle exception
		}finally {
			bs.close();
		}
//		System.out.println(sb);
		br.close();
		
	}

}
