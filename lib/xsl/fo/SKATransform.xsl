<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:d="http://docbook.org/ns/docbook"
  xmlns:exsl="http://exslt.org/common" version="1.0" exclude-result-prefixes="exsl d">

  <xsl:import href="docbook_custom.xsl"/>

<!-- This stylesheet was copied from C:\Program Files\Oxygen XML Editor 12\frameworks\docbook\xsl\fo/titlepage-templates.xsl-->
<!-- changes wrt original are marked with the keyword CHANGE -->

<!--
 *
 *    (c) European Southern Observatory, 2011
 *    Copyright by ESO
 *    All rights reserved
 *
 *    This library is free software; you can redistribute it and/or
 *    modify it under the terms of the GNU Lesser General Public
 *    License as published by the Free Software Foundation; either
 *    version 2.1 of the License, or (at your option) any later version.
 *
 *    This library is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *    Lesser General Public License for more details.
 *
 *    You should have received a copy of the GNU Lesser General Public
 *    License along with this library; if not, write to the Free Software
 *    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307  USA
 *
 *    $Id: ESOTransform.xsl 616 2012-10-02 09:28:16Z karo-se2 $
 *
 *
-->
<!--  ************don't put a separator after pubdate because it is the last entry******************-->
<xsl:template match="processing-instruction('linebreak')">
  <fo:block/>
</xsl:template>


<xsl:template match="d:pubdate" mode="bibliography.mode">
  <fo:inline>
    <xsl:apply-templates mode="bibliography.mode"/>
 <!--   <xsl:value-of select="$biblioentry.item.separator"/> -->
  </fo:inline>
</xsl:template>

  <!--  ******************************-->

  <xsl:attribute-set name="list.block.spacing">
    <xsl:attribute name="margin-left">0.25in</xsl:attribute>
  </xsl:attribute-set>

  <!--  ******************************-->

  <xsl:attribute-set name="book.titlepage.recto.style">
    <xsl:attribute name="font-family">
      <xsl:value-of select="$title.fontset"/>
    </xsl:attribute>
    <xsl:attribute name="font-weight">bold</xsl:attribute>
    <xsl:attribute name="font-size">12pt</xsl:attribute>
    <xsl:attribute name="text-align">left</xsl:attribute>
  </xsl:attribute-set>

  <!--  ******************************-->

  <xsl:attribute-set name="book.titlepage.verso.style">
    <xsl:attribute name="font-family">
      <xsl:value-of select="$title.fontset"/>
    </xsl:attribute>
    <xsl:attribute name="font-weight">bold</xsl:attribute>
    <xsl:attribute name="font-size">12pt</xsl:attribute>
    <xsl:attribute name="text-align">left</xsl:attribute>
  </xsl:attribute-set>

  <!--  ******************************-->

  <xsl:attribute-set name="formal.title.properties"
    use-attribute-sets="normal.para.spacing">
    <xsl:attribute name="text-align">center</xsl:attribute>
  </xsl:attribute-set>

  <!--  ******************************-->


<xsl:template name="book.titlepage">
  <fo:block xmlns:fo="http://www.w3.org/1999/XSL/Format">
    <xsl:variable name="recto.content">
    <!-- CHANGE - commented to avoid having two pages for the title page pageclass -->
<!--      <xsl:call-template name="book.titlepage.before.recto"/>-->
      <xsl:call-template name="book.titlepage.recto"/>
    </xsl:variable>
    <xsl:variable name="recto.elements.count">
      <xsl:choose>
        <xsl:when test="function-available('exsl:node-set')"><xsl:value-of select="count(exsl:node-set($recto.content)/*)"/></xsl:when>
        <xsl:when test="contains(system-property('xsl:vendor'), 'Apache Software Foundation')">
          <!--Xalan quirk--><xsl:value-of select="count(exsl:node-set($recto.content)/*)"/></xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:if test="(normalize-space($recto.content) != '') or ($recto.elements.count &gt; 0)">
      <fo:block break-after="page"><xsl:copy-of select="$recto.content"/></fo:block>
    </xsl:if>

    <xsl:variable name="verso.content">
      <xsl:call-template name="book.titlepage.before.verso"/>
      <xsl:call-template name="book.titlepage.verso"/>
    </xsl:variable>
    <xsl:variable name="verso.elements.count">
      <xsl:choose>
        <xsl:when test="function-available('exsl:node-set')"><xsl:value-of select="count(exsl:node-set($verso.content)/*)"/></xsl:when>
        <xsl:when test="contains(system-property('xsl:vendor'), 'Apache Software Foundation')">
          <!--Xalan quirk--><xsl:value-of select="count(exsl:node-set($verso.content)/*)"/></xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <!-- *** SKA: Commented out this if which causes a 'Publication date' text entry *** -->
    <!-- <xsl:if test="(normalize&#45;space($verso.content) != '') or ($verso.elements.count &#38;gt; 0)"> -->
    <!--   <fo:block><xsl:copy&#45;of select="$verso.content"/></fo:block> -->
    <!-- </xsl:if> -->
    <!-- <xsl:call&#45;template name="book.titlepage.separator"/> -->
  </fo:block>
</xsl:template>

  <!--  ******************************-->

<!-- *** SKA: Attribute-set for blocks of Titlepage info table *** -->
<xsl:attribute-set name="titlepage.docinfo-table.block">
  <xsl:attribute name="space-before">2pt</xsl:attribute>
  <xsl:attribute name="space-after">2pt</xsl:attribute>
  <xsl:attribute name="text-align-last">justify</xsl:attribute>
</xsl:attribute-set>

<!-- *** SKA: Attribute-set for cells of Titlepage signature table *** -->
<xsl:attribute-set name="titlepage.signature-table.cell">
  <xsl:attribute name="padding-before">2pt</xsl:attribute>
  <xsl:attribute name="padding-after">2pt</xsl:attribute>
  <xsl:attribute name="border-style">solid</xsl:attribute>
  <xsl:attribute name="border-width">0.2mm</xsl:attribute>
  <xsl:attribute name="border-color">#2b54a2</xsl:attribute>
  <xsl:attribute name="display-align">center</xsl:attribute>
  <xsl:attribute name="text-align">center</xsl:attribute>
</xsl:attribute-set>

<!-- *** SKA: Attribute-set for cells of Authors table *** -->
<xsl:attribute-set name="titlepage.authors-table.cell">
  <xsl:attribute name="padding-before">2pt</xsl:attribute>
  <xsl:attribute name="padding-after">2pt</xsl:attribute>
  <xsl:attribute name="border-style">solid</xsl:attribute>
  <xsl:attribute name="border-width">0.2mm</xsl:attribute>
  <xsl:attribute name="border-color">#2b54a2</xsl:attribute>
  <xsl:attribute name="display-align">center</xsl:attribute>
  <xsl:attribute name="text-align">center</xsl:attribute>
</xsl:attribute-set>

<!-- *** SKA: Attribute-set for cells of Document History table *** -->
<xsl:attribute-set name="titlepage.dochistory-table.cell">
  <xsl:attribute name="padding-before">3pt</xsl:attribute>
  <xsl:attribute name="padding-after">3pt</xsl:attribute>
  <xsl:attribute name="border-style">solid</xsl:attribute>
  <xsl:attribute name="border-width">0.2mm</xsl:attribute>
  <xsl:attribute name="display-align">center</xsl:attribute>
  <xsl:attribute name="text-align">center</xsl:attribute>
</xsl:attribute-set>

<!-- *** SKA: Attribute-set for cells of Document Software table *** -->
<xsl:attribute-set name="titlepage.docsw-table.cell">
  <xsl:attribute name="padding-before">3pt</xsl:attribute>
  <xsl:attribute name="padding-after">3pt</xsl:attribute>
  <xsl:attribute name="border-style">solid</xsl:attribute>
  <xsl:attribute name="border-width">0.2mm</xsl:attribute>
  <xsl:attribute name="display-align">center</xsl:attribute>
  <xsl:attribute name="text-align">center</xsl:attribute>
</xsl:attribute-set>

<!-- *** SKA: Attribute-set for cells of Organisation Details table *** -->
<xsl:attribute-set name="titlepage.orgdetail-table.cell">
  <xsl:attribute name="padding-before">3pt</xsl:attribute>
  <xsl:attribute name="padding-after">3pt</xsl:attribute>
  <xsl:attribute name="border-style">solid</xsl:attribute>
  <xsl:attribute name="border-width">0.2mm</xsl:attribute>
  <xsl:attribute name="display-align">center</xsl:attribute>
</xsl:attribute-set>

<!-- *** SKA: Recursively find newline escape characters \n and format correctly -->
<xsl:template name="ska.para.format-newlines">
    <xsl:param name = "para" />
    <xsl:variable name="line" select="substring-before($para,'\n')"/>
    <xsl:choose>
        <xsl:when test="$line">
            <fo:block>
                <xsl:value-of select="$line"/>
                <xsl:text>&#xa;</xsl:text>
            </fo:block>
        </xsl:when>
        <xsl:otherwise>
            <fo:block>
                <xsl:value-of select="$para"/>
            </fo:block>
        </xsl:otherwise>
    </xsl:choose>
    <!-- evaluate and recurse -->
    <xsl:if test="string-length(substring-after($para,'\n'))!=0">
        <xsl:call-template name="ska.para.format-newlines">
            <xsl:with-param name="para" select="substring-after($para,'\n')"/>
        </xsl:call-template>
    </xsl:if>
</xsl:template>

<xsl:template name="book.titlepage.recto">

    <!-- *** SKA: Titlepage logo *** -->
    <fo:block space-after="2.5cm">
      <xsl:attribute name="space-before.minimum">8cm</xsl:attribute>
      <fo:block text-align="center">
        <!-- SKA: Note that the base path for the plugin is the root of the Cameo install directory -->
        <fo:external-graphic src="lib/xsl/fo/SKA_TM_Logo.jpg" content-width="8cm"/>
      </fo:block>
      <xsl:attribute name="space-after.minimum">8cm</xsl:attribute>
    </fo:block>
    <!-- SKA: Note that all the custom SKA fields are present as XML tags in the
              the 'productnumber' docbook field -->
    <xsl:variable name="document.element" select="ancestor-or-self::*"/>

    <!-- *** SKA: Titlepage document info block *** -->
    <fo:table table-layout="fixed" border-width="0.4mm" border-style="solid" border-color="#2b54a2">
      <fo:table-column column-number="1" column-width="30%"/>
      <fo:table-column column-number="2" column-width="70%"/>
      <fo:table-body start-indent="3pt" end-indent="3pt" color="#2b54a2" font-size="10pt" font-family="{$title.fontset}">
        <!-- SKA: Document title -->
        <fo:table-row>
          <fo:table-cell number-columns-spanned="2" padding-top="5pt" padding-bottom="10pt">
            <fo:block text-align="center" font-size="16pt" font-weight="bold">
                <xsl:value-of select="$document.element/d:info/d:subtitle[1]"/>
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
        <!-- SKA: Document titlepage info block -->
        <fo:table-row>
          <fo:table-cell number-columns-spanned="2" padding-top="5pt" padding-bottom="10pt">
            <xsl:for-each select="$document.element/d:info/d:productnumber/d:ska-field[@type='docinfo']">
                <fo:block xsl:use-attribute-sets="titlepage.docinfo-table.block">
                    <xsl:value-of select="d:name" />
                    <fo:leader leader-pattern="dots"/>
                    <xsl:value-of select="d:value" />
                </fo:block>
            </xsl:for-each>
            <fo:block xsl:use-attribute-sets="titlepage.docinfo-table.block">
                Revision
                <fo:leader leader-pattern="dots"/>
                <xsl:value-of select="$document.element/d:info/d:issuenum[1]"/>
            </fo:block>
            <fo:block xsl:use-attribute-sets="titlepage.docinfo-table.block">
                Date
                <fo:leader leader-pattern="dots"/>
                <xsl:value-of select="$document.element/d:info/d:pubdate[1]"/>
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>

    <fo:block space-before="20pt"/>

    <!-- *** SKA: Titlepage signatures table *** -->
    <fo:table table-layout="fixed" border-width="0.6mm" border-style="solid" color="#2b54a2" border-color="#2b54a2">
      <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="3" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="4" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="5" column-width="proportional-column-width(1)"/>
      <fo:table-header start-indent="3pt" end-indent="3pt" font-size="10pt" font-weight="bold" font-family="{$title.fontset}" text-align="center">
        <fo:table-row xsl:use-attribute-sets="titlepage.signature-table.cell">
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
              Name
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
              Designation
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
              Affiliation
              </fo:block>
            </fo:table-cell>
            <fo:table-cell number-columns-spanned="2" xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
              Signature
              </fo:block>
            </fo:table-cell>
        </fo:table-row>
      </fo:table-header>
      <fo:table-body start-indent="3pt" end-indent="3pt" font-size="10pt" font-family="{$title.fontset}">
          <!-- Custodian -->
          <fo:table-row>
            <fo:table-cell number-columns-spanned="5" xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block text-align="center">
              Custodian
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <fo:table-row height="2cm">
            <xsl:variable name="ska.custodian" select="$document.element/d:info/d:productnumber/d:ska-field[@type='custodian']" />
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.custodian/d:name" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.custodian/d:designation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.custodian/d:affiliation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell number-columns-spanned="2" xsl:use-attribute-sets="titlepage.signature-table.cell" display-align="after" text-align="left">
              <fo:block>
              Date:
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <!-- Approved by-->
          <fo:table-row>
            <fo:table-cell number-columns-spanned="5" xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block text-align="center">
              Approved by
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <fo:table-row height="2cm">
            <xsl:variable name="ska.approver" select="$document.element/d:info/d:productnumber/d:ska-field[@type='approver']" />
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.approver/d:name" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.approver/d:designation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.approver/d:affiliation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell number-columns-spanned="2" xsl:use-attribute-sets="titlepage.signature-table.cell" display-align="after" text-align="left">
              <fo:block>
              Date:
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <!-- Accepted by-->
          <fo:table-row>
            <fo:table-cell number-columns-spanned="5" xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block text-align="center">
              Accepted by
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <fo:table-row height="2cm">
            <xsl:variable name="ska.accepter" select="$document.element/d:info/d:productnumber/d:ska-field[@type='accepter']" />
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.accepter/d:name" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.accepter/d:designation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.accepter/d:affiliation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell number-columns-spanned="2" xsl:use-attribute-sets="titlepage.signature-table.cell" display-align="after" text-align="left">
              <fo:block>
              Date:
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <!-- Released by-->
          <fo:table-row>
            <fo:table-cell number-columns-spanned="5" xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block text-align="center">
              Released by
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <fo:table-row height="2cm">
            <xsl:variable name="ska.releaser" select="$document.element/d:info/d:productnumber/d:ska-field[@type='releaser']" />
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.releaser/d:name" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.releaser/d:designation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.signature-table.cell">
              <fo:block>
                    <xsl:value-of select="$ska.releaser/d:affiliation" />
              </fo:block>
            </fo:table-cell>
            <fo:table-cell number-columns-spanned="2" xsl:use-attribute-sets="titlepage.signature-table.cell" display-align="after" text-align="left">
              <fo:block>
              Date:
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
      </fo:table-body>
    </fo:table>

    <fo:block>
      <xsl:attribute name="space-before.minimum">6cm</xsl:attribute>
    </fo:block>

    <!-- *** SKA: Authors table *** -->
    <fo:table table-layout="fixed" border-width="0.6mm" border-style="solid" color="#2b54a2" border-color="#2b54a2" break-after="page">
      <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="3" column-width="proportional-column-width(1)"/>
      <fo:table-header start-indent="3pt" end-indent="3pt" font-size="10pt" font-weight="bold" font-family="{$title.fontset}" text-align="center">
        <fo:table-row xsl:use-attribute-sets="titlepage.authors-table.cell">
            <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
              <fo:block>
              Name
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
              <fo:block>
              Designation
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
              <fo:block>
              Affiliation
              </fo:block>
            </fo:table-cell>
        </fo:table-row>
      </fo:table-header>
      <fo:table-body start-indent="3pt" end-indent="3pt" font-size="10pt" font-family="{$title.fontset}">
          <!-- Authors  -->
          <fo:table-row>
            <fo:table-cell number-columns-spanned="3" xsl:use-attribute-sets="titlepage.authors-table.cell">
              <fo:block text-align="center" font-style="italic">
               Author(s)
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <xsl:for-each select="$document.element/d:info/d:productnumber/d:ska-field[@type='author']">
            <fo:table-row height="1cm">
                <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
                <fo:block>
                    <xsl:value-of select="d:name" />
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
                <fo:block>
                    <xsl:value-of select="d:designation" />
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
                <fo:block>
                    <xsl:value-of select="d:affiliation" />
                </fo:block>
                </fo:table-cell>
            </fo:table-row>
          </xsl:for-each>
          <!-- Contributors -->
          <fo:table-row>
            <fo:table-cell number-columns-spanned="3" xsl:use-attribute-sets="titlepage.authors-table.cell">
              <fo:block text-align="center" font-style="italic">
              Contributor(s)
              </fo:block>
            </fo:table-cell>
          </fo:table-row>
          <xsl:for-each select="$document.element/d:info/d:productnumber/d:ska-field[@type='contributor']">
            <fo:table-row height="1cm">
                <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
                <fo:block>
                    <xsl:value-of select="d:name" />
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
                <fo:block>
                    <xsl:value-of select="d:designation" />
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.authors-table.cell">
                <fo:block>
                    <xsl:value-of select="d:affiliation" />
                </fo:block>
                </fo:table-cell>
            </fo:table-row>
          </xsl:for-each>
      </fo:table-body>
    </fo:table>

    <!-- *** SKA: Document History table *** -->
    <fo:block font-size="14pt" font-weight="bold" text-align="center" padding-after="2pt">DOCUMENT HISTORY</fo:block>
    <fo:table table-layout="fixed" border-width="0.6mm" border-style="solid">
      <fo:table-column column-number="1" column-width="10%"/>
      <fo:table-column column-number="2" column-width="18%"/>
      <fo:table-column column-number="3" column-width="18%"/>
      <fo:table-column column-number="4" column-width="54%"/>
      <fo:table-header start-indent="1pt" end-indent="1pt" font-size="8pt" font-weight="bold" font-family="{$title.fontset}" text-align="center">
        <fo:table-row xsl:use-attribute-sets="titlepage.dochistory-table.cell">
            <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
              <fo:block padding-before="3pt" padding-after="3pt">
              Revision
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
              <fo:block padding-before="3pt" padding-after="3pt">
              Date Of Issue
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
              <fo:block padding-before="3pt" padding-after="3pt">
              Engineering Change Number
              </fo:block>
            </fo:table-cell>
            <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
              <fo:block padding-before="3pt" padding-after="3pt">
              Comments
              </fo:block>
            </fo:table-cell>
        </fo:table-row>
      </fo:table-header>
      <fo:table-body start-indent="1pt" end-indent="1pt" font-size="8pt" font-family="{$title.fontset}">
          <xsl:choose>
          <xsl:when test="d:bookinfo/d:revhistory/d:revision">
            <xsl:for-each select="d:bookinfo/d:revhistory/d:revision">
                <fo:table-row>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <fo:block>
                        <xsl:value-of select="d:revnumber" />
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <fo:block>
                        <xsl:value-of select="d:date" />
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <xsl:call-template name="ska.para.format-newlines">
                        <xsl:with-param name="para" select="d:revremark"/>
                    </xsl:call-template>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <xsl:call-template name="ska.para.format-newlines">
                        <xsl:with-param name="para" select="d:revdescription"/>
                    </xsl:call-template>
                    </fo:table-cell>
                </fo:table-row>
            </xsl:for-each>
          </xsl:when>
          <xsl:otherwise>
                <fo:table-row>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <fo:block>
                        Unknown
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <fo:block>
                        Unknown
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <fo:block>
                        Unknown
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.dochistory-table.cell">
                    <fo:block>
                        Unknown
                    </fo:block>
                    </fo:table-cell>
                </fo:table-row>
          </xsl:otherwise>
          </xsl:choose>
      </fo:table-body>
    </fo:table>

    <!-- *** SKA: Document Software table *** -->
    <xsl:if test="$document.element/d:info/d:productnumber/d:ska-field[@type='docsw']">
        <fo:block padding-bottom="1cm" />
        <fo:block font-size="14pt" font-weight="bold" text-align="center" padding-after="2pt">DOCUMENT SOFTWARE</fo:block>
        <fo:table table-layout="fixed" border-width="0.6mm" border-style="solid">
        <fo:table-column column-number="1" column-width="20%"/>
        <fo:table-column column-number="2" column-width="20%"/>
        <fo:table-column column-number="3" column-width="20%"/>
        <fo:table-column column-number="4" column-width="40%"/>
        <fo:table-header start-indent="1pt" end-indent="1pt" font-size="8pt" font-weight="bold" font-family="{$title.fontset}" text-align="center">
            <fo:table-row xsl:use-attribute-sets="titlepage.docsw-table.cell">
                <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                <fo:block padding-before="3pt" padding-after="3pt">
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                <fo:block padding-before="3pt" padding-after="3pt">
                Package
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                <fo:block padding-before="3pt" padding-after="3pt">
                Version
                </fo:block>
                </fo:table-cell>
                <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                <fo:block padding-before="3pt" padding-after="3pt">
                Filename
                </fo:block>
                </fo:table-cell>
            </fo:table-row>
        </fo:table-header>
        <fo:table-body start-indent="1pt" end-indent="1pt" font-size="8pt" font-family="{$title.fontset}">
            <xsl:for-each select="$document.element/d:info/d:productnumber/d:ska-field[@type='docsw']">
                <fo:table-row>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                    <fo:block font-weight="bold">
                        <xsl:value-of select="d:type" />
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                    <fo:block>
                        <xsl:value-of select="d:package" />
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                    <fo:block>
                        <xsl:value-of select="d:version" />
                    </fo:block>
                    </fo:table-cell>
                    <fo:table-cell xsl:use-attribute-sets="titlepage.docsw-table.cell">
                    <fo:block>
                        <xsl:value-of select="d:filename" />
                    </fo:block>
                    </fo:table-cell>
                </fo:table-row>
            </xsl:for-each>
        </fo:table-body>
        </fo:table>
    </xsl:if>

    <!-- *** SKA: Organisation Details table *** -->
    <xsl:if test="$document.element/d:info/d:productnumber/d:ska-field[@type='orgdetail']">
        <fo:block padding-bottom="1cm" />
        <fo:block font-size="14pt" font-weight="bold" text-align="center" padding-after="2pt">ORGANISATION DETAILS</fo:block>
        <fo:table table-layout="fixed" border-width="0.6mm" border-style="solid">
        <fo:table-column column-number="1" column-width="30%"/>
        <fo:table-column column-number="2" column-width="70%"/>
            <fo:table-body start-indent="1pt" end-indent="1pt" font-size="8pt" font-family="{$title.fontset}">
                <xsl:for-each select="$document.element/d:info/d:productnumber/d:ska-field[@type='orgdetail']">
                    <fo:table-row>
                        <fo:table-cell xsl:use-attribute-sets="titlepage.orgdetail-table.cell">
                            <fo:block text-align="center">
                                <xsl:value-of select="d:name" />
                            </fo:block>
                        </fo:table-cell>
                        <fo:table-cell xsl:use-attribute-sets="titlepage.orgdetail-table.cell">
                            <fo:block>
                                <xsl:call-template name="ska.para.format-newlines">
                                    <xsl:with-param name="para" select="d:value"/>
                                </xsl:call-template>
                            </fo:block>
                        </fo:table-cell>
                    </fo:table-row>
                    </xsl:for-each>
            </fo:table-body>
        </fo:table>
    </xsl:if>

</xsl:template>

  <!--  ******************************-->

  <xsl:template match="d:title" mode="book.titlepage.recto.auto.mode">
    <fo:block xmlns:fo="http://www.w3.org/1999/XSL/Format"  space-before="10cm" font-weight="bold" font-family="{$title.fontset}">

      <xsl:call-template name="division.title">
        <xsl:with-param name="node" select="ancestor-or-self::d:book[1]"/>
      </xsl:call-template>
    </fo:block>
  </xsl:template>

  <!--  ******************************-->
  <!--  continouos numbering -->
  <xsl:template name="initial.page.number">auto</xsl:template>
  <xsl:template name="page.number.format">1</xsl:template>

  <xsl:template match="d:info/d:author[@role]" mode="book.titlepage.verso.mode">
    <xsl:choose>
      <xsl:when test="@role = 'author'">
    <fo:table table-layout="fixed" border-width="0.5mm" border-style="solid">
      <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
      <fo:table-body start-indent="0pt" end-indent="0pt">
        <fo:table-row>
          <fo:table-cell padding="1mm" border-width="0.5mm" border-style="solid">
            <fo:block text-align="left"><xsl:call-template name="person.name"/></fo:block>
          </fo:table-cell>
          <fo:table-cell padding="1mm" border-width="0.5mm" border-style="solid">
            <fo:block text-align="left"><xsl:apply-templates mode="book.titlepage.verso.auto.mode" select="d:affiliation"/></fo:block>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>
      </xsl:when>
    </xsl:choose>
  </xsl:template>


  <!--- ChangeRecord implementation, MBDG-11 -->

<xsl:template match="d:bookinfo/d:revhistory/d:revision"  mode="book.titlepage.verso.mode">
  <xsl:variable name="revnumber" select="d:revnumber"/>
  <xsl:variable name="revdate"   select="d:date"/>
  <xsl:variable name="revauthor" select="d:authorinitials|d:author"/>
  <xsl:variable name="revremark" select="d:revremark"/>
  <xsl:variable name="revdescription" select="d:revdescription"/>
  <fo:table-row>

    <fo:table-cell padding="1mm" border-width="0.5mm" border-style="solid" >
      <fo:block>
        <xsl:call-template name="anchor"/>
        <xsl:if test="$revnumber">
          <xsl:call-template name="gentext.space"/>
          <xsl:apply-templates select="$revnumber[1]"/>
        </xsl:if>
      </fo:block>
    </fo:table-cell>

    <fo:table-cell padding="1mm" border-width="0.5mm" border-style="solid">
      <fo:block>
        <xsl:apply-templates select="$revdate[1]"/>
      </fo:block>
    </fo:table-cell>


    <!-- revdescription is used to comment on modified sections  -->
   <fo:table-cell padding="1mm" border-width="0.5mm" border-style="solid">
      <fo:block>
      <xsl:apply-templates select="$revdescription[1]" />
      </fo:block>
    </fo:table-cell>

	<fo:table-cell padding="1mm" border-width="0.5mm" border-style="solid">
		<fo:block>
			<xsl:if test="$revremark">
				<fo:block>
					<xsl:apply-templates select="$revremark[1]" />
				</fo:block>
			</xsl:if>

		</fo:block>
	</fo:table-cell>
  </fo:table-row>
 </xsl:template>


  <!--  ******************************-->


  <xsl:template match="d:book/d:info/d:author[@role]|d:book/d:info/d:author[@role]" mode="titlepage.mode">
    <fo:block  xsl:use-attribute-sets="book.titlepage.recto.style">
     <xsl:choose>
       <xsl:when test="@role = 'wpManager'">
          <fo:table table-layout="fixed">
            <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
            <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
            <fo:table-column column-number="3" column-width="proportional-column-width(2)"/>
            <fo:table-body start-indent="0pt" end-indent="0pt">
              <fo:table-row>
                <fo:table-cell><fo:block text-align="left">WP Manager</fo:block>
                </fo:table-cell>
                <fo:table-cell>
                  <fo:block text-align="left"><xsl:call-template name="person.name"/></fo:block>
                </fo:table-cell>
                <fo:table-cell>
                  <fo:block text-align="left">______________________________</fo:block>
                </fo:table-cell>
              </fo:table-row>
            </fo:table-body>
          </fo:table>
        </xsl:when>
       <xsl:when test="@role = 'releaser'">
          <fo:table table-layout="fixed">
            <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
            <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
            <fo:table-column column-number="3" column-width="proportional-column-width(2)"/>
            <fo:table-body start-indent="0pt" end-indent="0pt">
              <fo:table-row>
                <fo:table-cell><fo:block text-align="left">Releaser</fo:block>
                </fo:table-cell>
                <fo:table-cell>
                  <fo:block text-align="left"><xsl:call-template name="person.name"/></fo:block>
                </fo:table-cell>
                <fo:table-cell>
                  <fo:block text-align="left">______________________________</fo:block>
                </fo:table-cell>
              </fo:table-row>
            </fo:table-body>
          </fo:table>
        </xsl:when>
        <xsl:when test="@role = 'owner'">
          <fo:table table-layout="fixed">
            <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
            <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
            <fo:table-column column-number="3" column-width="proportional-column-width(2)"/>
            <fo:table-body start-indent="0pt" end-indent="0pt">
              <fo:table-row>
                <fo:table-cell><fo:block text-align="left">Owner</fo:block>
                </fo:table-cell>
                <fo:table-cell>
                  <fo:block text-align="left"><xsl:call-template name="person.name"/></fo:block>
                </fo:table-cell>
                <fo:table-cell>
                  <fo:block text-align="left">______________________________</fo:block>
                </fo:table-cell>
              </fo:table-row>
            </fo:table-body>
          </fo:table>
        </xsl:when>
      </xsl:choose>
    </fo:block>
  </xsl:template>

  <!--  ******************************-->

  <xsl:template match="d:book/d:info/d:author[@role]|d:book/d:info/d:author[@role]" mode="book.titlepage.verso.auto.mode">
    <fo:block  xsl:use-attribute-sets="book.titlepage.verso.style">
      <xsl:choose>
        <xsl:when test="@role = 'author'">
          <xsl:call-template name="person.name"/>
        </xsl:when>
      </xsl:choose>
    </fo:block>
  </xsl:template>

  <!--  ******************************-->

  <xsl:template match="d:info/d:revhistory" mode="book.titlepage.verso.auto.mode">

    <xsl:variable name="explicit.table.width">
      <xsl:call-template name="pi.dbfo_table-width"/>
    </xsl:variable>

    <xsl:variable name="table.width">
      <xsl:choose>
        <xsl:when test="$explicit.table.width != ''">
          <xsl:value-of select="$explicit.table.width"/>
        </xsl:when>
        <xsl:when test="$default.table.width = ''">
          <xsl:text>100%</xsl:text>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$default.table.width"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <fo:table table-layout="fixed" width="{$table.width}" xsl:use-attribute-sets="revhistory.table.properties">
      <fo:table-column column-number="1" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
      <fo:table-column column-number="3" column-width="proportional-column-width(1)"/>
      <fo:table-body start-indent="0pt" end-indent="0pt">
        <fo:table-row>
          <fo:table-cell number-columns-spanned="3" xsl:use-attribute-sets="revhistory.table.cell.properties">
            <fo:block xsl:use-attribute-sets="revhistory.title.properties">
              <xsl:choose>
                <xsl:when test="d:title|d:info/d:title">
                  <xsl:apply-templates select="d:title|d:info/d:title" mode="titlepage.mode"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:call-template name="gentext">
                    <xsl:with-param name="key" select="'RevHistory'"/>
                  </xsl:call-template>
                </xsl:otherwise>
              </xsl:choose>
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
        <xsl:apply-templates select="*[not(self::d:title)]" mode="titlepage.mode"/>
      </fo:table-body>
    </fo:table>
  </xsl:template>

<!--*************************************************-->
  <!-- change default proportions of header columns -->

  <xsl:param name="header.column.widths">1 8 4</xsl:param>

  <!--******************************-->

  <!-- Change default values of parameters defined in params.xsl -->
  <xsl:param name="generate.toc">
    /appendix toc,title
    article/appendix  nop
    /article  toc,title
    book      toc,title,figure,table
    /chapter  toc,title
    part      toc,title
    /preface  toc,title
    reference toc,title
    /sect1    toc
    /sect2    toc
    /sect3    toc
    /sect4    toc
    /sect5    toc
    /section  toc
    set       toc,title
  </xsl:param>

  <xsl:param name="biblioentry.item.separator">, </xsl:param>
  <xsl:param name="body.font.family">Helvetica</xsl:param>
  <xsl:param name="body.font.size">10pt</xsl:param>
  <xsl:param name="body.margin.top">0.7in</xsl:param>
  <xsl:param name="paper.type">A4</xsl:param>
  <xsl:param name="fop1.extensions">1</xsl:param>
  <xsl:param name="fop.extensions">0</xsl:param>
  <xsl:param name="toc.section.depth">5</xsl:param>

  <xsl:param name="section.autolabel" select="1"/>
  <xsl:param name="section.label.includes.component.label" select="1"/>
  <xsl:param name="headers.on.blank.pages" select="1"/>
  <xsl:param name="formal.title.placement">
    figure after
    example after
    equation after
    table after
    procedure after
    task after
  </xsl:param>

  <xsl:attribute-set name="section.title.level1.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.4"/>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  <xsl:attribute-set name="section.title.level2.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.3"/>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  <xsl:attribute-set name="section.title.level3.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.2"/>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>
  <xsl:attribute-set name="section.title.level4.properties">
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.1"/>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>

  <xsl:param name="body.start.indent">
    <xsl:choose>
      <xsl:when test="$fop.extensions != 0">0pt</xsl:when>
      <xsl:when test="$passivetex.extensions != 0">0pt</xsl:when>
      <xsl:otherwise>0pc</xsl:otherwise>
    </xsl:choose>
  </xsl:param>

  <!-- Change default values of parameters defined in titlepages-templates.xsl -->

  <xsl:template match="d:title" mode="chapter.titlepage.recto.auto.mode">
    <fo:block xmlns:fo="http://www.w3.org/1999/XSL/Format" xsl:use-attribute-sets="chapter.titlepage.recto.style" font-weight="bold">
      <xsl:attribute name="font-size">
        <xsl:value-of select="$body.font.master * 1.6"/>
        <xsl:text>pt</xsl:text>
      </xsl:attribute>
      <xsl:call-template name="component.title">
        <xsl:with-param name="node" select="ancestor-or-self::d:chapter[1]"/>
      </xsl:call-template>
    </fo:block>
  </xsl:template>

  <xsl:attribute-set name="formal.title.properties" use-attribute-sets="normal.para.spacing">
    <xsl:attribute name="font-weight">bold</xsl:attribute>
    <xsl:attribute name="font-size">
      <xsl:value-of select="$body.font.master * 1.2"></xsl:value-of>
      <xsl:text>pt</xsl:text>
    </xsl:attribute>
    <xsl:attribute name="hyphenate">false</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.4em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.6em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.8em</xsl:attribute>
  </xsl:attribute-set>

  <!--******************************-->

  <xsl:template match="caption">
    <fo:block  text-align="center">
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <xsl:template match="processing-instruction('linebreak')">
    <fo:block/>
  </xsl:template>

  <!-- ACHTUNG, ADDED FOR TEST PURPOSES, MZA/RKA -->
  <doc:refentry xmlns:doc="http://nwalsh.com/xsl/documentation/1.0" id="ESO.logo.image">
    <refmeta>
      <refentrytitle>ESO.logo.image</refentrytitle>
      <refmiscinfo class="other" otherclass="datatype">uri</refmiscinfo>
    </refmeta>
    <refnamediv>
      <refname>ESO.logo.image</refname>
      <refpurpose>The URI of the image to be used for draft watermarks</refpurpose>
    </refnamediv>
    <refsection>
      <info>
        <title>Description</title>
      </info>
      <para>The image to be used for ESO Logo</para>
    </refsection>
  </doc:refentry>
  <xsl:param name="ESO.logo.image"
    >http://webnri.hq.eso.org/downloads/eso-logo-p3005.jpg</xsl:param>

  <xsl:template name="draft.text">
    <xsl:choose>
      <xsl:when test="$draft.mode = 'yes'">
        <xsl:call-template name="gentext">
          <xsl:with-param name="key" select="'Draft'"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$draft.mode = 'no'">
        <!-- nop -->
      </xsl:when>
      <xsl:when test="ancestor-or-self::*[@status][1]/@status = 'draft'">
        <xsl:call-template name="gentext">
          <xsl:with-param name="key" select="'Draft'"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <!-- nop -->
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="get.doc.date">
    <xsl:choose>
      <xsl:when test="//*[local-name() = 'date']">
        <xsl:value-of select="//*[local-name() = 'date']"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>


<!--******************************-->

  <!-- *** SKA: Attribute-set for footer *** -->
  <xsl:attribute-set name="footer.block">
  <!-- <xsl:attribute name="space&#45;before">2pt</xsl:attribute> -->
  <!-- <xsl:attribute name="space&#45;after">2pt</xsl:attribute> -->
  <xsl:attribute name="font-size">8pt</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template name="footer.content">
    <xsl:param name="pageclass" select="''"/>
    <xsl:param name="sequence" select="''"/>
    <xsl:param name="position" select="''"/>
    <xsl:param name="gentext-key" select="''"/>

    <xsl:variable name="document.element" select="ancestor-or-self::*" />

    <xsl:choose>
        <xsl:when test="$pageclass != 'titlepage' or ($pageclass = 'titlepage' and $sequence!='first')">
            <xsl:choose>

              <xsl:when test="$sequence='blank'">
              <!-- no output -->
              </xsl:when>

              <xsl:when test="$double.sided = 0 and $position='left'">

                <fo:block xsl:use-attribute-sets="footer.block">
                    Document No.: <xsl:value-of select="$document.element/d:info/d:productnumber/d:ska-field[d:name='TM Number']/d:value" />
                    Revision: <xsl:value-of select="$document.element/d:info/d:issuenum[1]"/>
                </fo:block>

                <xsl:variable name="date">
                    Date:
                    <xsl:choose>
                    <xsl:when test="$document.element/d:info/d:pubdate[1]">
                        <xsl:value-of select="$document.element/d:info/d:pubdate[1]"/>
                    </xsl:when>
                    <xsl:otherwise>[could not find document date]</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <fo:block xsl:use-attribute-sets="footer.block">
                <xsl:value-of select="$date"/>
                </fo:block>
              </xsl:when>

              <xsl:when test="$double.sided = 0 and $position = 'center'">
                <fo:block text-align="center">
                </fo:block>
              </xsl:when>

              <xsl:when test="$position = 'right'" >
                <fo:block xsl:use-attribute-sets="footer.block" text-align="end">
                    <xsl:value-of select="$document.element/d:info/d:productnumber/d:ska-field[d:name='Document Classification']/d:value" />
                </fo:block>
                <fo:block xsl:use-attribute-sets="footer.block" text-align="end">
                    Author: <xsl:value-of select="$document.element/d:info/d:productnumber/d:ska-field[d:name='Primary Author']/d:value" />
                </fo:block>

                <fo:block xsl:use-attribute-sets="footer.block">
                    Page <fo:page-number/> of <fo:page-number-citation ref-id="SKA.VeryLastPage"/>
                </fo:block>

              </xsl:when>
            </xsl:choose>
        </xsl:when>

        <xsl:when test="$pageclass = 'titlepage' and $sequence='first'">
            <!-- nothing for now -->
        </xsl:when>
    </xsl:choose>

  </xsl:template>

  <!--******************************-->

  <xsl:template name="header.table">
    <xsl:param name="pageclass" select="''"/>
    <xsl:param name="sequence" select="''"/>
    <xsl:param name="gentext-key" select="''"/>

    <!-- default is a single table style for all headers -->
    <!-- Customize it for different page classes or sequence location -->

    <xsl:choose>
      <xsl:when test="$pageclass = 'index'">
        <xsl:attribute name="margin-{$direction.align.start}">0pt</xsl:attribute>
      </xsl:when>
    </xsl:choose>

    <xsl:variable name="column1">
      <xsl:choose>
        <xsl:when test="$double.sided = 0">1</xsl:when>
        <xsl:when test="$sequence = 'first' or $sequence = 'odd'">1</xsl:when>
        <xsl:otherwise>3</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="column3">
      <xsl:choose>
        <xsl:when test="$double.sided = 0">3</xsl:when>
        <xsl:when test="$sequence = 'first' or $sequence = 'odd'">3</xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="candidate">
      <fo:table xsl:use-attribute-sets="header.table.properties">
        <xsl:call-template name="head.sep.rule">
          <xsl:with-param name="pageclass" select="$pageclass"/>
          <xsl:with-param name="sequence" select="$sequence"/>
          <xsl:with-param name="gentext-key" select="$gentext-key"/>
        </xsl:call-template>

        <fo:table-column column-number="1">
          <xsl:attribute name="column-width">
            <xsl:text>proportional-column-width(</xsl:text>
            <xsl:call-template name="header.footer.width">
              <xsl:with-param name="location">header</xsl:with-param>
              <xsl:with-param name="position" select="$column1"/>
            </xsl:call-template>
            <xsl:text>)</xsl:text>
          </xsl:attribute>
        </fo:table-column>
        <fo:table-column column-number="2">
          <xsl:attribute name="column-width">
            <xsl:text>proportional-column-width(</xsl:text>
            <xsl:call-template name="header.footer.width">
              <xsl:with-param name="location">header</xsl:with-param>
              <xsl:with-param name="position" select="2"/>
            </xsl:call-template>
            <xsl:text>)</xsl:text>
          </xsl:attribute>
        </fo:table-column>
        <xsl:choose>
          <xsl:when test="$pageclass = 'titlepage' and $gentext-key = 'book'
            and $sequence='first'">
            <!-- no output -->
          </xsl:when>
          <xsl:when test="$sequence = 'blank' and $headers.on.blank.pages = 0">
            <fo:block><xsl:call-template name="blank.page.content"/></fo:block>
          </xsl:when>
          <xsl:otherwise>
            <fo:table-column column-number="3">
              <xsl:attribute name="column-width">
                <xsl:text>proportional-column-width(</xsl:text>
                <xsl:call-template name="header.footer.width">
                  <xsl:with-param name="location">header</xsl:with-param>
                  <xsl:with-param name="position" select="$column3"/>
                </xsl:call-template>
                <xsl:text>)</xsl:text>
              </xsl:attribute>
            </fo:table-column>
          </xsl:otherwise>
        </xsl:choose>


        <fo:table-body>
          <fo:table-row>
            <xsl:attribute name="block-progression-dimension.minimum">
              <xsl:value-of select="$header.table.height"/>
            </xsl:attribute>
            <fo:table-cell text-align="start"
              display-align="before">
              <xsl:if test="$fop.extensions = 0">
                <xsl:attribute name="relative-align">baseline</xsl:attribute>
              </xsl:if>
              <fo:block>
                <xsl:call-template name="header.content">
                  <xsl:with-param name="pageclass" select="$pageclass"/>
                  <xsl:with-param name="sequence" select="$sequence"/>
                  <xsl:with-param name="position" select="$direction.align.start"/>
                  <xsl:with-param name="gentext-key" select="$gentext-key"/>
                </xsl:call-template>
              </fo:block>
            </fo:table-cell>
            <fo:table-cell text-align="center"
              display-align="before">
              <xsl:if test="$fop.extensions = 0">
                <xsl:attribute name="relative-align">baseline</xsl:attribute>
              </xsl:if>
              <fo:block>
                <xsl:call-template name="header.content">
                  <xsl:with-param name="pageclass" select="$pageclass"/>
                  <xsl:with-param name="sequence" select="$sequence"/>
                  <xsl:with-param name="position" select="'center'"/>
                  <xsl:with-param name="gentext-key" select="$gentext-key"/>
                </xsl:call-template>
              </fo:block>
            </fo:table-cell>
            <xsl:choose>
              <xsl:when test="$pageclass = 'titlepage' and $gentext-key = 'book'
                and $sequence='first'">
                <!-- no output -->
              </xsl:when>
              <xsl:when test="$sequence = 'blank' and $headers.on.blank.pages = 0">
                <!-- no output -->
              </xsl:when>
              <xsl:otherwise>
            <fo:table-cell text-align="right"
              display-align="before">
              <xsl:if test="$fop.extensions = 0">
                <xsl:attribute name="relative-align">baseline</xsl:attribute>
              </xsl:if>
              <fo:block>
                <xsl:call-template name="header.content">
                  <xsl:with-param name="pageclass" select="$pageclass"/>
                  <xsl:with-param name="sequence" select="$sequence"/>
                  <xsl:with-param name="position" select="$direction.align.end"/>
                  <xsl:with-param name="gentext-key" select="$gentext-key"/>
                </xsl:call-template>
              </fo:block>
            </fo:table-cell>
              </xsl:otherwise>
            </xsl:choose>
          </fo:table-row>
        </fo:table-body>
      </fo:table>
    </xsl:variable>

    <!-- Really output a header? -->
    <!-- SKA: Commented out to prevent headers -->
    <!-- <xsl:choose> -->
    <!--   <xsl:when test="$pageclass = 'titlepage' and $gentext&#45;key = 'book' -->
    <!--     and $sequence='first'"> -->
    <!--     <xsl:copy&#45;of select="$candidate"/> -->
    <!--   </xsl:when> -->
    <!--   <xsl:when test="$sequence = 'blank' and $headers.on.blank.pages = 0"> -->
    <!--     <!&#45;&#45; no output &#45;&#45;> -->
    <!--   </xsl:when> -->
    <!--   <xsl:otherwise> -->
    <!--     <xsl:copy&#45;of select="$candidate"/> -->
    <!--   </xsl:otherwise> -->
    <!-- </xsl:choose> -->
  </xsl:template>


<!--************************************************************************************-->

  <xsl:template name="blank.page.content">
    <fo:static-content flow-name="blank-body">
      <fo:block text-align="center">Page intentionally left blank</fo:block>
    </fo:static-content>
  </xsl:template>

  <!--************************************************************************************-->


</xsl:stylesheet>
