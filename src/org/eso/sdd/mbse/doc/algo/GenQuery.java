package org.eso.sdd.mbse.doc.algo;

import com.nomagic.uml2.ext.magicdraw.classes.mdkernel.Comment;
import com.nomagic.uml2.ext.magicdraw.classes.mdkernel.Element;
import com.nomagic.uml2.ext.magicdraw.classes.mdkernel.NamedElement;

public class GenQuery extends Query {

	public GenQuery(Element theQueryElement, boolean theDebug) {
		super(theQueryElement, theDebug);
		
	}
	
	public String provideDocBookForQuery() {
		String content = "";
		if (Debug) { System.out.println("  is Query  TYPE: " + 
				super.getQueryType(el) +" REP " +  ((tableRep)?"table":"Para") + " size: " + referenced.size()  );}

		if (referenced.size() == 0) {
			if (Debug) {
				// this generates an execption if the body is shorter than 20
				// chars - must be handled.
				//shorter than 20 have been handled
				int l = ((Comment) el).getBody().length();

				if (l > 20) {

					l = 20;
					System.out
							.println("  this query does not reference any element ("
									+ ((Comment) el).getBody().substring(1, l)
									+ ")");
				} else {
					System.out
							.println("  this query does not reference any element ("
									+ ((Comment) el).getBody() + ")");
				}
			}
		} else {
			System.out.println("");
		}
		content += "<para annotations=\"query " + queryType +  " format=" + ((tableRep)?"table":"Para") + 
		  " showQueriedElementDocumentation="+ 		showQueriedElementDocumentation + 
		" showTypesDocumentation="+  		showTypesDocumentation + 
		" showPropertiesDocumentation="+ 		showPropertiesDocumentation + 
		" showDefaultValue="+ 		showDefaultValue +"\">" + lE ;
		

		if(useText == Utilities.TEXTUSAGEKIND.before) { 
			content +=  Utilities.convertHTML2DocBook(((Comment)el).getBody(), true) + lE;
		} 
		content += "</para>" + lE; // moved here from the end to avoid having paras within paras
		// note: DocBook seems to allow a para in a para

		boolean tableHeaderDone = false;
		for (Object refElement : referenced) {
			if(refElement != null) {
				// special handling
				if(! (refElement instanceof NamedElement) ) {
					System.out.println("\tWARNING: referenced element is not a NamedElement type but a "+ 
							refElement.getClass().toString());
					continue;
				}
				NamedElement namedRefEl = (NamedElement)refElement;
				if(Debug) { 
					System.out.println("\treferenced element "+Utilities.replaceBracketCharacters (namedRefEl.getName()) + " [" + queryType +"]");				
				}

				// if the named referenced element is a requirement, it is handled and such and the value of queryType is 
				// entirely ignored.

				if( Utilities.isRequirement(namedRefEl) ) {
					if (tableRep && !tableHeaderDone) {
						content += "<table frame=\"all\"><title>"+ Utilities.replaceBracketCharacters (namedRefEl.getName()) + "</title>" +
								"<tgroup cols=\"3\"><thead><row><entry>ReqID</entry>" + 
								"<entry>ReqName</entry><entry>Text</entry></row></thead>" + 
								lE + "<tbody>";
						tableHeaderDone = true;
					}
					content += processRequirement(namedRefEl);
					continue;
				}

				// DOCUMENTATION
				
				if(queryType.equals("documentation")) { 
					if(tableRep) {
						if (!tableHeaderDone) {
							content +=  "<table><tgroup  cols=\"2\"><tbody>" + lE;
							tableHeaderDone = true;
						}
						content += "<row>";
						content += entryReplaceBrackets(namedRefEl.getName()) + lE;
						content += entryReplaceBrackets(Utilities.getDocumentation(namedRefEl)) + lE;
						content += "</row>" + lE;
						
					} else {
						// GENERIC ELEMENT INFO
						// representation attribute ignored in this case
						content +=  "<emphasis role=\"bold\">" + Utilities.replaceBracketCharacters(namedRefEl.getName()) + "</emphasis>";
						if(showQualifiedName) { 
							content += "<emphasis> ( " + Utilities.replaceBracketCharacters(namedRefEl.getQualifiedName()) + " )  </emphasis>" + lE;
						}
						content += "<para annotations=\"finished doc\">" + lE;

						if(Utilities.hasDocumentation(namedRefEl)) { 
							content += Utilities.getDocumentation(namedRefEl) + lE;
						}
						content += "</para><para></para>" + lE;
					}
				} else if(namedRefEl.hasOwnedElement()) {

					if(queryType.equals("operations")) { 	
						content += processOperations(namedRefEl);
					} else if(queryType.equals("properties")) {
						content += processProperties(namedRefEl);						
					} else if(queryType.equals("ports")) { 	
						content += processPorts(namedRefEl);
					} else if(queryType.equals("constraintProperties")) { 	
						content += processConstraintProperties(namedRefEl);					
					} else if(queryType.equals("constraints")) { 	
						content += processConstraints(namedRefEl);					
					} else if(queryType.equals("flowProperties")) { 	
						content += processFlowProperties(namedRefEl);					
					} else if(queryType.equals("partProperties")) { 	
						content += processPartProperties(namedRefEl);					
					} else if(queryType.equals("referenceProperties")) { 	
						content += processReferenceProperties(namedRefEl);					
					} else if(queryType.equals("valueProperties")) { 	
						content += processValueProperties(namedRefEl);					
					} 
					
					// ACTIVITIES

				} else { // no owned elements 
					// content += "this referenced object does not seem to have any owned elements.."+ lE;
				} // end if no owned elements

			} // referenced element not null
		} // end loop over all referenced elements
		if(tableRep && queryType.equals("documentation") && tableHeaderDone) {
			content += "</tbody></tgroup></table>" + lE;
		}
		//content += "</para>" + lE; // moved up to avoid having paras in paras
		return content;
	}

}
