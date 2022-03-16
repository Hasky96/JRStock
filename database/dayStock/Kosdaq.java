import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class Kosdaq {

	public static void main(String[] args) throws IOException {
		System.setIn(new FileInputStream("kosdaq.txt"));
		BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
		int[] arr=new int[1000000];
		int N=3098;
		for (int i=0; i<N; i++) {
			arr[Integer.parseInt(br.readLine())]++;
		}
		int count=0;
		for (int i=0; i<1000000; i++) {
			if (arr[i]==1) {
				count++;
				System.out.println(i);
			}
		}
		System.out.println(count);
		br.close();
	}

}
