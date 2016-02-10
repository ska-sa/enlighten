package org.eso.sdd.mbse.doc.algo;

//Java
import java.io.File;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;

//JAXP
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.Source;
import javax.xml.transform.Result;
import javax.xml.transform.stream.StreamSource;
import javax.xml.transform.sax.SAXResult;

//FOP
import org.apache.fop.apps.FOUserAgent;
import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FopFactory;
//import org.apache.fop.apps.FopFactoryConfig;
import org.apache.fop.apps.MimeConstants;


public class xsltFOPExecutor  {

	private static String xmlfile = null; // input
	private static String outputfile = null; // output
	private static String xsltfile = null; // transformer
	private static Boolean isDraftMode = true;
	private static String genMode;
	private static int status = 2;

	// private static boolean ABORTED = false;



	public xsltFOPExecutor(String mode,Boolean draft, String trans,String input, String output) {
		super();
		genMode = mode;
		isDraftMode = draft;
		xmlfile = input;
		xsltfile = trans;
		outputfile = output;
		
	}

	public static void setXMLFile(String xml) {
		xmlfile = xml;
	}

	public static void setXSLTFile(String xslt) {
		xsltfile = xslt;
	}

	public static void setPDFFile(String pdf) {
		outputfile = pdf;
	}

	public static void setRTFFile(String rtf) {
		outputfile = rtf;
	}

	public static void setDraft(Boolean b) {
		isDraftMode = b;
	}
	
	public int getStatus() {
		return status;
	}
	
	
	public void generateGeneric() { 
		String tMIME = null;
		if(genMode.equals("PDF")) { 
			tMIME = MimeConstants.MIME_PDF;
		} else {
			tMIME = MimeConstants.MIME_RTF;			
		}
		

		try {
			System.out.println("FOP Transformation\n");
			System.out.println("Preparing...");

			String fileName = new File(xsltfile).getName();
			//File xsltfile = new File("lib/xsl2/xslt/base/fo/" + fileName); 
			File xsltfile = new File("lib/xsl/fo/" + fileName); 

			// configure fopFactory.4. as desired
			//FopFactoryConfig ffc = new FopFactoryConfig();

			//FopFactory fopFactory = FopFactory.newInstance(new File(".").toURI()) ; // .newInstance();
			FopFactory fopFactory = FopFactory.newInstance();
			FOUserAgent foUserAgent = fopFactory.newFOUserAgent();

			foUserAgent.setTitle("TEST");

			// configure foUserAgent as desired

			// Setup output
			OutputStream out = new java.io.FileOutputStream(outputfile);
			out = new java.io.BufferedOutputStream(out);

			try {
				TransformerFactory factory = TransformerFactory.newInstance();
				Transformer transformer = factory
						.newTransformer(new StreamSource(xsltfile));

				//test run to get total pagecount
				Fop fop = fopFactory.newFop(tMIME,	foUserAgent, out);
				Source src = new StreamSource(xmlfile);
				Result res = new SAXResult(fop.getDefaultHandler());
				transformer.transform(src, res);


				//Get total page count
				String pageCount = "UNAVAILABLE"; 
				if(fop.getResults() != null) { 
					pageCount = Integer.toString(fop.getResults().getPageCount()); 
				} else {

				}
				System.out.println("totalcc "+ pageCount);

				//real run
				// Construct fop with desired output format
				fop = fopFactory.newFop(tMIME,	foUserAgent, out);

				//set draft parameter
				String draftImageFn = new File("lib/xsl/images/draft.png").toURI().toString(); // .getAbsolutePath();
				transformer.setParameter("draft.watermark.image", draftImageFn); 
				System.out.println(transformer.getParameter("draft.watermark.image"));

				if (isDraftMode)    { 
					transformer.setParameter("draft.mode", "yes"); 
				} 	else  { 
					transformer.setParameter("draft.mode", "no"); 
				} 

				transformer.setParameter("draft.mode", pageCount); 

				//set pagecount parameter
				transformer.setParameter("ebnf.statement.terminator", pageCount); 


				// Resulting SAX events (the generated FO) must be piped
				// through
				// to FOP
				res = new SAXResult(fop.getDefaultHandler());

				// Start XSLT transformation and FOP processing
				transformer.transform(src, res);


			} finally {
				out.close();
				status = 0;
			}

			System.out.println("Success!");
			System.out.println("DocBook "+genMode+" generation COMPLETED");

		} catch (Exception e) {
			e.printStackTrace(System.err);
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			status = 2;
			return;
		}
	}

	public static void main(String[] args) {
		System.err.println("FOP Converter");
		//System.err.println(System.getProperty("java.class.path"));
		// check on number of parameters
		if(args.length != 5) { 
			System.err.println("Wrong number of parameters");
			return;
		}
		// diagnostic
		System.err.println("Size of arguments array:" + args.length);
		for(int i = 0; i < args.length;i++) { 
			System.err.println("ARG: " + args[i]);
		}

		xsltFOPExecutor xMain = null;
		xMain = new xsltFOPExecutor(args[0],Boolean.valueOf(args[1]),args[2],args[3],args[4]);
		xMain.generateGeneric();
		//System.exit(0);
	}

}
