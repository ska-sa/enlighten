package org.eso.sdd.mbse.doc.algo;

import java.io.BufferedReader;
//Java
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;




import org.eso.sdd.mbse.doc.options.MBSEOptionsGroup;

import com.nomagic.magicdraw.core.Application;
import com.nomagic.magicdraw.core.options.EnvironmentOptions;
import com.nomagic.task.ProgressStatus;
import com.nomagic.task.RunnableWithProgress;
import com.nomagic.uml2.ext.magicdraw.classes.mdkernel.NamedElement;

public class SpawnFOP implements RunnableWithProgress {

	/** Determines which targets shall be generated. */
	public enum GENERATION_MODE { XML_AND_PDF, PDF_ONLY, RTF_ONLY,XML_AND_RTF };

	private static File xmlfile = null;
	private static File outputfile = null;
	private static Object userObject = null;

	private ProgressStatus theProgressStatus = null;

	// private static boolean ABORTED = false;

	private static int status = 2;
	private final GENERATION_MODE genMode;

	public SpawnFOP(GENERATION_MODE mode) {
		genMode = mode;
	}

	public static void setXMLFile(File xml) {
		xmlfile = xml;
	}

	public static void setPDFFile(File pdf) {
		outputfile = pdf;
	}

	public static void setRTFFile(File rtf) {
		outputfile = rtf;
	}

	public static void setUserObject(Object obj) {
		userObject = obj;
	}

	public int getStatus() {
		return status;
	}
	
	
	public void spawnGeneric(String type) {
		String fqPathName = "org.eso.sdd.mbse.doc.algo.xsltFOP2";
		boolean extCmnd = false;
		boolean classLoader = false;
		boolean directCall = true;
		/* 
		 * taking out for now
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e1) {
			e1.printStackTrace();
    		StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e1.printStackTrace(pw);

			genUtility.displayWarning(sw.toString());
		}// sleep for 1000 ms

*/
		if (theProgressStatus.isCancel()) {
			System.out.println("** DocBook "+ type +" generation cancelled by user");
			status = 1;
			return;
		} else {

			CommonGenerator theGenerator = new CommonGenerator();

			if(GENERATION_MODE.XML_AND_PDF == genMode  || 
					GENERATION_MODE.XML_AND_RTF == genMode  ) {
				CommonGenerator.setDestFile(xmlfile);
				CommonGenerator.setStartElement((NamedElement) userObject);
				theGenerator.generate();
			}

			System.out.println("FOP Transformation\n");
			System.out.println("Preparing...");

			Application application = Application.getInstance(); 
			EnvironmentOptions options = application.getEnvironmentOptions(); 
			MBSEOptionsGroup g = (MBSEOptionsGroup) options.getGroup("options.mbse"); 

			String fn = g.getTransformationPropertyValue(); 
			/* need to extract filename if it is a full path */ 
			String fileName = new File(fn).getName();
			//File xsltfile = new File("lib/xsl2/xslt/base/fo/" + fileName); 
			File xsltfile = new File("lib/xsl/fo/" + fileName); 

			//
			System.out.println("Input: XML (" + xmlfile + ")");
			System.out.println("Stylesheet: " + xsltfile);
			System.out.println("Output: "+ type +" (" + outputfile + ")");
			System.out.println();
			System.out.println("Transforming...");


			//MZA TEST
			if(extCmnd) { 
				String javaHome = System.getProperty("java.home");
				String os = System.getProperty("os.name");
				String javawBin = javaHome + File.separator + "bin" + File.separator + "java";
				String cmdString = "";
				if (os.toLowerCase().contains("win")) {
					javawBin += ".exe";
				}

				List<String> cmd = new ArrayList<String>();

				cmd.add("\"" + javawBin + "\"");
				//cmd.add("-cp");
				//cmd.add("\"C:\\myjar.jar\"");
				cmd.add(fqPathName);
				cmdString = "\"" + javawBin + "\" " + fqPathName;
				cmdString = cmdString + " " + type + " " +  g.isDraftMode() +
						" \"" + xsltfile + "\"" + 
						" \"" + xmlfile + "\"" + 
						" \"" + outputfile + "\"";
				System.out.println("Running: " + cmdString);

				try  {            
					Runtime rt = Runtime.getRuntime();
					Process proc = rt.exec(cmdString); 
					InputStream    stderr = proc.getErrorStream();
					InputStreamReader isr = new InputStreamReader(stderr);

					OutputStream stdin = proc.getOutputStream();

					//OutputStreamWriter osr = new OutputStreamWriter(stdout);
					BufferedReader br = new BufferedReader(isr);
					//BufferedReader reader = new BufferedReader (new InputStreamReader(stdout));				

					String line = null;
					while ( (line = br.readLine()) != null)
						System.out.println(line);
					int exitVal = proc.waitFor();
					System.out.println("Process exitValue: " + exitVal);
				} catch (Throwable t)  {
					t.printStackTrace();
				}
			} 
			if(classLoader){ // variant with ClassLoader
				ClassLoader classloader = null;
				Class mainClass = null;
				Method main  = null;
				List<URL> urls = new ArrayList();				

				String HOME = "D:\\workspace\\MBSEPlugin\\";
		        String CLASSES = HOME + "\\bin";
		        String LIB = HOME + "\\lib";

		        // add the classes dir and each jar in lib to a List of URLs.
		        
		        try { 
		        	urls.add(new File(CLASSES).toURL());
		        	for (File f : new File(LIB).listFiles()) {
		        		urls.add(f.toURL());
		        		System.out.println(f.toURL());
		        	}
		        } catch(MalformedURLException mue) {
		        	mue.printStackTrace();
		        	return;
		        }

		        // feed your URLs to a URLClassLoader!
		        
		        urls.toArray(new URL[0]);
		        
		        classloader = new URLClassLoader(urls.toArray(new URL[0]) ,
		        			ClassLoader.getSystemClassLoader().getParent());

		        System.out.println("Classloader instantiated");
		        System.out.flush();
		        // relative to that classloader, find the main class
		        // you want to bootstrap, which is the first cmd line arg
		        try { 
		        	mainClass = classloader.loadClass(fqPathName);
		        } catch(ClassNotFoundException cnfe) {
		        	cnfe.printStackTrace();
		        	System.err.println(cnfe.getMessage());
		        	System.err.flush();
		        	return;
		        }
				System.out.println("Class instantiated");
		        
				String[] args = new String[] { type ,
							Boolean.valueOf(g.isDraftMode()).toString(),
							xsltfile.toPath().toString() ,	
							"" + xmlfile,
							 outputfile.toPath().toString() };
				
				try { 
					main = mainClass.getMethod("main",  new Class[] { args.getClass()});
				} catch(NoSuchMethodException nsme) { 
					nsme.printStackTrace();
					System.err.flush();
					return;
				}
				System.out.println("Method instantiated");
				
				System.out.println("Starting Thread");
				Thread.currentThread().setContextClassLoader(classloader);

		        try {
					main.invoke(null, new Object[] { args });
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					return;
				} catch (IllegalArgumentException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					return;
				} catch (InvocationTargetException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					return;
				}
			}
			if(directCall) { 
				xsltFOPExecutor xFOP = new xsltFOPExecutor(type ,g.isDraftMode(),
						"" + xsltfile,
						"" + xmlfile ,
						"" + outputfile );
				xFOP.generateGeneric();
				
			}
		}
	}

	@Override
	public void run(ProgressStatus ps) {
		theProgressStatus = ps;
		theProgressStatus.init("Generating...", 100);
		theProgressStatus.setIndeterminate(true);
		if(genMode == GENERATION_MODE.PDF_ONLY || 	genMode == GENERATION_MODE.XML_AND_PDF) {
			spawnGeneric("PDF");
		} else {
			spawnGeneric("RTF");
		}
	}	

}
