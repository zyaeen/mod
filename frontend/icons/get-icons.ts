import '@vaadin/icon/vaadin-iconset.js';
import {
    BLACK,
    DEFAULT_LD_COMPONENTS_COLOR,
    WHITE
} from 'Frontend/components/network-editor-components/common/ColorPicker';

export function createTemplate() {

    const template = document.createElement('template');

    template.innerHTML = `
<vaadin-iconset name="lean-di-icons" size="24">
  <svg><defs>
    <g id="lean-di-icons:anchor-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->



<svg id="eNpRr3mKytf1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)" stroke-width="0"/><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" stroke-width="0"/><rect width="13.134338" height="13.134338" rx="0" ry="0" transform="matrix(.861863 0 0 0.861863 11 11)" stroke="${DEFAULT_LD_COMPONENTS_COLOR}"/></svg>


</g>


<g id="lean-di-icons:connect"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg id="erjfgG5kCou1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2" height="3" rx="0" ry="0" transform="translate(3 0)" stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="translate(3 5)" stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 8 3)" stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 3 3)" stroke-width="0"/><rect width="2" height="2" rx="0" ry="0" transform="translate(3 3)" stroke-width="0"/><ellipse rx="2.486625" ry="2.486625" transform="translate(8 19.688271)" stroke-width="0"/><ellipse rx="2.486625" ry="2.486625" transform="translate(20.138889 8.986625)" stroke-width="0"/><line x1="-4.826132" y1="4.600823" x2="4.826132" y2="-4.600823" transform="matrix(1.257091 0 0 1.150495 14.072002 14.279849)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="0.8"/></svg>
</g>



    <g id="lean-di-icons:knot"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->


<svg cache-id="d1664d1f75414a2eaf28fd109ecb2e87" id="eOsGTfF9g5Y1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)" stroke-width="0"/><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" stroke-width="0"/><rect width="13.134338" height="13.134338" rx="3" ry="3" transform="matrix(.861863 0 0 0.861863 11 11)" fill="none" stroke-width="2" stroke="${DEFAULT_LD_COMPONENTS_COLOR}"/></svg>


</g>

    <g id="lean-di-icons:anchor-tx"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->



<svg id="enKJcTNL0yf1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)" stroke-width="0"/><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" stroke-width="0"/><rect width="13.134338" height="13.134338" rx="0" ry="0" transform="matrix(.861863 0 0 0.861863 11 11)" stroke="${DEFAULT_LD_COMPONENTS_COLOR}"/><text dx="0" dy="0" font-family="&quot;enKJcTNL0yf1:::Roboto&quot;" font-size="1.2" font-weight="700" transform="matrix(7.33772 0 0 7.33772 11 8.876836)" stroke-width="0"><tspan y="0" font-family="&quot;enKJcTNL0yf1:::Roboto&quot;" font-size="1.2" font-weight="700" font-style="normal" stroke-width="0"><![CDATA[

TX 

]]></tspan></text>
<style><![CDATA[
@font-face {font-family: 'enKJcTNL0yf1:::Roboto';font-style: normal;font-weight: 700;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');}
]]></style>
</svg>




</g>

    <g id="lean-di-icons:attribute-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg id="ewQOYtGIo5k1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.761366 0.719697)" stroke-width="0"/><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.801082)" stroke-width="0"/><rect width="14.104219" height="14.104219" rx="7.05" ry="7.05" transform="translate(8.842752 8.950654)" stroke-width="0" stroke-linecap="round"/></svg>

</g>
    <g id="lean-di-icons:attribute-composed-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg id="eF6IwekgaGo1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.761366 0.719697)" stroke-width="0"/><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.801082)" stroke-width="0"/><rect width="14.104219" height="14.104219" rx="7.05" ry="7.05" transform="translate(8.842752 8.950654)" stroke-width="0" stroke-linecap="round"/><rect width="14.104219" height="14.104219" rx="7.05" ry="7.05" transform="translate(1.790643 8.950654)" stroke-width="0" stroke-linecap="round"/></svg>


</g>
    <g id="lean-di-icons:attribute-his-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg id="e3rRPjKx7hE1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)" stroke-width="0"/><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" stroke-width="0"/><rect width="14.1042" height="14.1042" rx="7.05" ry="7.05" transform="translate(8.84275 8.95065)" fill="none" stroke-width="1.8" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round"/><rect width="14.1042" height="14.1042" rx="7.05" ry="7.05" transform="translate(8.84275 8.95065)" fill="none" stroke-width="0" stroke-linecap="round"/><rect width="14.1042" height="14.1042" rx="7.05" ry="7.05" transform="matrix(.611769 0 0 0.611769 11.580572 11.68847)" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round"/></svg>


</g>

    <g id="lean-di-icons:tie-a-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg id="eO8AqGiQNDg1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)" stroke-width="0"/><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" stroke-width="0"/><rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.501346-.501346 0.501346 0.501346 5.69318 16.0028)" stroke-width="0" stroke-linecap="round"/><text dx="0" dy="0" font-family="&quot;eO8AqGiQNDg1:::Roboto&quot;" font-size="1.2" font-weight="700" transform="matrix(8.870385 0 0 8.870385 14.241624 9.800592)" stroke-width="0"><tspan y="0" font-weight="700" stroke-width="0"><![CDATA[
 A 
]]></tspan></text>
<style><![CDATA[
@font-face {font-family: 'eO8AqGiQNDg1:::Roboto';font-style: normal;font-weight: 700;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');}
]]></style>
</svg>



</g>

    <g id="lean-di-icons:tie-tx-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<svg width="30px" height="30px" id="eMlh3yzq8nU1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2" height="3" rx="0" ry="0" transform="translate(3 0)"  stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="translate(3 5)"  stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 8 3)"  stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 3 3.000002)"  stroke-width="0"/><rect width="2" height="2" rx="0" ry="0" transform="translate(3 3)"  stroke-width="0"/><rect width="11" height="11" rx="0" ry="0" transform="matrix(.707107-.707107 0.707107 0.707107 8.443651 16.221825)"  stroke-width="0"/><text dx="0" dy="0" font-family="&quot;eMlh3yzq8nU1:::Roboto&quot;" font-size="1.2" font-weight="400" transform="matrix(6.690839 0 0 6.103142 18.277043 9.965022)"  stroke-width="0"><tspan y="0" font-weight="400" stroke-width="0"><![CDATA[
TX
]]></tspan></text>
<style><![CDATA[
@font-face {font-family: 'eMlh3yzq8nU1:::Roboto';font-style: normal;font-weight: 400;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');}
]]></style>
</svg>

</g>

    <g id="lean-di-icons:tie-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<svg id="ePpWtfS6odv1" xmlns="http://www.w3.org/2000/svg" 
xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision"
 text-rendering="geometricPrecision">
 
 <rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)"
  stroke-width="1.7"/>
  
  <rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" 
  stroke-width="1.7"/>
  
  <rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.501346-.501346 0.501346 0.501346 8.842749 16.021732)" fill="${DEFAULT_LD_COMPONENTS_COLOR}"
   stroke="${DEFAULT_LD_COMPONENTS_COLOR}"  stroke-width="1.7" stroke-linecap="round"/>
<!--   <rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.299379-.299379 0.299379 0.299379 11.691339 16.021732)"  stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.7" stroke-linecap="round"/>-->
   
   </svg>

</g>

    <g id="lean-di-icons:tie-his-tx-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg id="eh2JtIfH8nz1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2" height="3" rx="0" ry="0" transform="translate(3 0)"  stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="translate(3 5)"  stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 8 3)"  stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 3 3.000002)"  stroke-width="0"/><rect width="2" height="2" rx="0" ry="0" transform="translate(3 3)"  stroke-width="0"/><rect width="11" height="11" rx="0" ry="0" transform="matrix(.707107-.707107 0.707107 0.707107 8.443651 16.221825)"  stroke-width="0"/><rect width="11" height="11" rx="0" ry="0" transform="matrix(.707107-.707107 0.707107 0.707107 8.443651 16.221825)"  stroke-width="0"/><text dx="0" dy="0" font-family="&quot;eh2JtIfH8nz1:::Roboto&quot;" font-size="1.2" font-weight="400" transform="matrix(6.690839 0 0 6.103142 18.277043 9.965022)"  stroke-width="0"><tspan y="0" font-weight="400" stroke-width="0"><![CDATA[
TX
]]></tspan></text><rect width="9" height="9" rx="0" ry="0" transform="matrix(.707107-.707107 0.707107 0.707107 9.857864 16.221825)" fill="#fff" stroke-width="0"/><rect width="7" height="7" rx="0" ry="0" transform="matrix(.707107-.707107 0.707107 0.707107 11.272078 16.221825)"  stroke-width="0"/>
<style><![CDATA[
@font-face {font-family: 'eh2JtIfH8nz1:::Roboto';font-style: normal;font-weight: 400;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');}
]]></style>
</svg>



</g>

    <g id="lean-di-icons:tie-his-a-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->



<svg id="e0ExAbYBWvJ1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)" stroke-width="0"/><rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" stroke-width="0"/><rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.501346-.501346 0.501346 0.501346 5.69318 16.0028)" fill="none" stroke-width="1.7" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round"/><text dx="0" dy="0" font-family="&quot;e0ExAbYBWvJ1:::Roboto&quot;" font-size="1.2" font-weight="700" transform="matrix(8.87 0 0 8.87 14.24 9.801211)" stroke-width="0"><tspan y="0" font-weight="700" stroke-width="0"><![CDATA[
 A 
]]></tspan></text><rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.299379-.299379 0.299379 0.299379 8.541766 16.0028)" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-linecap="round"/>
<style><![CDATA[
@font-face {font-family: 'e0ExAbYBWvJ1:::Roboto';font-style: normal;font-weight: 700;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');}
]]></style>
</svg>




</g>
    <g id="lean-di-icons:tie-his-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->




<svg id="ePpWtfS6odv1" xmlns="http://www.w3.org/2000/svg" 
xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision"
 text-rendering="geometricPrecision">
 
 <rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.76137 0.719697)"
  stroke-width="1.7"/>
  
  <rect width="2.99242" height="10.0303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.80108)" 
  stroke-width="1.7"/>
  
  <rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.501346-.501346 0.501346 0.501346 8.842749 16.021732)" fill="none"
   stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.7" stroke-linecap="round"/>
   <rect width="14.1042" height="14.1042" rx="0" ry="0" transform="matrix(.299379-.299379 0.299379 0.299379 11.691339 16.021732)"  stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.7" stroke-linecap="round"/>
   
   </svg>



</g>
  </defs></svg>
  
<g id="lean-di-icons:tie-self-add"><?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg id="eWgn0zVBNI11" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.761366 0.719697)" stroke-width="0"/><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.801082)" stroke-width="0"/><ellipse rx="4.544048" ry="4.544048" stroke-width="1.7" transform="translate(17.308318 8.413323)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}"/><rect width="14.104219" height="14.104219" rx="0" ry="0" transform="matrix(.501346-.501346 0.501346 0.501346 5.69318 16.002765)" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-linecap="round"/></svg>
</g>
  
<!--  -->
<!--  <g id="lean-di-icons:domain-add">-->
<!--  <?xml version="1.0" encoding="UTF-8" standalone="no"?>-->
<!--  <svg id="e0gfU2YQaLd1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="2" height="3" rx="0" ry="0" transform="translate(3 0)" stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="translate(3 5)" stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 8 3)" stroke-width="0"/><rect width="2" height="3" rx="0" ry="0" transform="matrix(0 1-1 0 3 3)" stroke-width="0"/><rect width="2" height="2" rx="0" ry="0" transform="translate(3 3)" stroke-width="0"/><polygon points="0,-6.165295 5.863544,-1.905181 3.62387,4.987829 -3.62387,4.987829 -5.863544,-1.905181 0,-6.165295" transform="matrix(.89839 0 0 0.89839 10.732251 11.524273)" stroke-width="0"/></svg>-->

<!--</g>-->

  <g id="lean-di-icons:anchor-cd">

<svg id="emybuzwY8cD1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="4.06688" height="4.29324" rx="0" ry="0" transform="matrix(2.784082 0 0 2.637283 11 11)" fill="#bed9fc" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="0.5" stroke-dasharray="1,1,1,1"/><rect width="1.93" height="8.23" rx="0" ry="0" transform="translate(3.76 0.72)" stroke-width="0"/><rect width="1.93" height="8.23" rx="0" ry="0" transform="matrix(0-1 1 0 0.61 5.8)" stroke-width="0"/></svg>
</g>

  <g id="lean-di-icons:database">
<svg id="ewK5PTbyZit1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 250 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><ellipse rx="81.259842" ry="30.236221" transform="matrix(1.451141 0 0 1.440336 125 49.95892)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="10"/><line x1="0" y1="-94.873481" x2="0" y2="94.873481" transform="matrix(-1 0 0 1 6.479937 144.832401)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="15"/><line x1="0" y1="-94.873481" x2="0" y2="94.873481" transform="matrix(-1 0 0 1 242.91952 144.832401)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="15"/><path d="M6.479937,235.418977c-.600542,51.646626,236.439583,45.558094,236.439583,0" transform="translate(0 2.402169)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="15"/></svg>
</g>

  <g id="lean-di-icons:deploy">
<svg id="evwnWFsc7bO1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><ellipse rx="32.244094" ry="32.244094" transform="matrix(.769231 0 0 0.769231 150 150)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(-.885249 0 0-.885249 150 81.9685)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(0 0.886271-.886271 0 213.115184 150.000001)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(.671041 0.671041-.671041 0.671041 199.606308 101.338585)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(.600276 0.600276-.600276 0.600276 103.228366 197.716551)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(.87022 0 0 0.87022 150 218.0315)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(0 0.9194-.9194 0 87.283445 150.000002)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(-.631149 0.631149-.631149-.631149 103.228366 101.338585)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="0" y1="43.228343" x2="0" y2="-43.228343" transform="matrix(.579511-.579511 0.579511 0.579511 195.354341 192.992162)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 65.433068 63.779527)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 150 31.984363)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 150 267.543197)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 236.45669 63.779527)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 236.456695 234.330711)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 65.433068 234.330711)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 268.015639 150.000003)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="21.259842" ry="21.259842" transform="matrix(1.027777 0 0 1.027777 32.456803 150.000003)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/></svg>
</g>

  <g id="lean-di-icons:domain">
<svg id="exp4EHK1kcl1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><rect width="50" height="50" rx="5" ry="5" transform="matrix(1.145735 0 0 1.145735 17.596889 71.356625)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="12"/><ellipse rx="28.110236" ry="28.110236" transform="matrix(.705883 0 0 0.705883 148.110234 36.614174)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="15"/><ellipse rx="28.110236" ry="28.110236" transform="matrix(.731092 0 0 0.731092 160.393718 159.133858)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="15"/><line x1="-28.857393" y1="18.582677" x2="28.857393" y2="-18.582677" transform="matrix(.989086 0 0 1.118644 103.426082 66.771654)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="13"/><line x1="-32.164494" y1="-18.425196" x2="32.164494" y2="18.425197" transform="translate(107.048133 131.338594)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="13"/></svg>
</g>

  <g id="lean-di-icons:project">
<svg id="eXCThqs7eg61" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><ellipse rx="75.35433" ry="48.897638" transform="translate(86.692913 74.40945)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><ellipse rx="75.35433" ry="48.897638" transform="translate(213.307086 235.511813)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/><line x1="-21.259843" y1="-42.992126" x2="21.259842" y2="42.992126" transform="translate(159.212599 148.346457)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="20"/></svg>
</g>

  <g id="lean-di-icons:domain-add">
<svg cache-id="fe25454ee0784767a8f2e5f05e4825a3" id="etAaMLhqwYe1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><g><path d="M0.65156,3.23588h2.64388v-2.64388h2.71212v2.64388h2.64388v2.71212h-2.64388v2.64388h-2.71212v-2.64388h-2.64388v-2.71212Z" fill=${DEFAULT_LD_COMPONENTS_COLOR} stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="0.03"/><ellipse rx="6.5" ry="6.5" transform="matrix(1.188203 0 0 0.824973 14.185455 16.014671)" fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-width="1.5"/></g></svg>
</g>


<g id="lean-di-icons:hosts">
<svg
   fill="none"
   stroke="${DEFAULT_LD_COMPONENTS_COLOR}"
   stroke-width="12"
   version="1.1"
   id="Capa_1"
   viewBox="0 0 144.708 144.708"
   xml:space="preserve"
   sodipodi:docname="databases-symbol-variant-for-interface-svgrepo-com (1).svg"
   inkscape:version="1.3 (0e150ed6c4, 2023-07-21)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs5" /><sodipodi:namedview
   id="namedview5"
   pagecolor="#ffffff"
   bordercolor="#000000"
   borderopacity="0.25"
   inkscape:showpageshadow="2"
   inkscape:pageopacity="0.0"
   inkscape:pagecheckerboard="0"
   inkscape:deskcolor="#d1d1d1"
   inkscape:zoom="1.4525"
   inkscape:cx="399.65577"
   inkscape:cy="400"
   inkscape:window-width="2560"
   inkscape:window-height="1351"
   inkscape:window-x="2151"
   inkscape:window-y="-9"
   inkscape:window-maximized="1"
   inkscape:current-layer="Capa_1" />&#10;<g
   id="g5"
   transform="matrix(0.88468158,0,0,0.88468158,8.3437487,8.3437487)">&#10;	<g
   id="g4">&#10;		<path
   d="m 66.356,80.749 c 0.499,0.664 0.828,1.327 0.828,1.942 0,4.214 -12.084,10.339 -31.006,10.339 -18.932,0 -31.016,-6.113 -31.016,-10.339 0,-4.22 12.084,-10.34 31.016,-10.34 0.871,0 1.656,0.079 2.5,0.104 -1.41,-1.065 -2.6,-2.234 -3.529,-3.501 -18.551,0.219 -33.43,6.26 -33.43,13.737 v 48.238 c 0,7.611 15.427,13.779 34.459,13.779 19.028,0 34.449,-6.168 34.449,-13.779 V 82.691 c 0,-0.603 -0.256,-1.182 -0.444,-1.767 -1.278,-0.023 -2.554,-0.091 -3.827,-0.175 z"
   id="path1" />&#10;		<path
   d="m 109.559,68.954 c -0.925,1.267 -2.125,2.436 -3.531,3.501 0.847,-0.024 1.632,-0.104 2.503,-0.104 18.931,0 31.012,6.12 31.012,10.34 0,4.226 -12.081,10.339 -31.012,10.339 -18.932,0 -31.007,-6.113 -31.007,-10.339 0,-0.609 0.329,-1.267 0.828,-1.942 -1.272,0.085 -2.548,0.14 -3.827,0.176 -0.188,0.573 -0.444,1.157 -0.444,1.767 v 48.231 c 0,7.618 15.427,13.78 34.45,13.78 19.04,0 34.458,-6.162 34.458,-13.78 V 82.691 c -0.001,-7.478 -14.883,-13.519 -33.43,-13.737 z"
   id="path2" />&#10;		<g
   id="g3">&#10;			<path
   d="M 72.354,0 C 53.325,0 37.904,6.166 37.904,13.78 v 48.235 c 0,7.614 15.427,13.782 34.45,13.782 19.022,0 34.452,-6.168 34.452,-13.782 V 13.78 C 106.807,6.166 91.383,0 72.354,0 Z m 0,3.45 c 18.931,0 31.018,6.116 31.018,10.336 0,4.217 -12.087,10.34 -31.018,10.34 -18.932,0 -31.016,-6.123 -31.016,-10.34 C 41.339,9.566 53.423,3.45 72.354,3.45 Z"
   id="path3" />&#10;		</g>&#10;	</g>&#10;</g>&#10;</svg>


   
   </g>

<g id="lean-di-icons:dom-add">
<svg id="ednQArIWky01" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><polygon points="40.86,14.3 23.89,4.5 7.03,14.23 24,24.03 40.86,14.3" transform="matrix(.805157 0 0 0.805157 11.483731 10.006706)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polygon points="24,24.03 7.03,14.23 7.03,33.7 24,43.5 24,24.03" transform="matrix(.80724 0 0 0.80724 11.389431 10.040206)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polygon points="24,24.03 7.03,14.23 7.03,33.7 24,43.5 24,24.03" transform="matrix(-.80724 0 0 0.80724 50.057339 10.040206)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect width="4.92424" height="16.2121" rx="0" ry="0" transform="translate(7.82576 2.19697)" stroke-width="0"/><rect width="4.92424" height="16.2121" rx="0" ry="0" transform="matrix(0-1 1 0 2.18182 12.7652)" stroke-width="0"/></svg>
<!--<svg id="eWByNs0KGmc1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><polygon points="40.86,14.3 23.89,4.5 7.03,14.23 24,24.03 40.86,14.3" transform="matrix(.805157 0 0 0.805157 14.210969 11.976405)" fill="none" stroke-width="3" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-linecap="round" stroke-linejoin="round"/><polygon points="24,24.03 7.03,14.23 7.03,33.7 24,43.5 24,24.03" transform="matrix(.80724 0 0 0.80724 14.116694 12.009944)" fill="none" stroke-width="3" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-linecap="round" stroke-linejoin="round"/><polygon points="24,24.03 7.03,14.23 7.03,33.7 24,43.5 24,24.03" transform="matrix(-.80724 0 0 0.80724 52.784582 12.009944)" fill="none" stroke-width="3" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-linecap="round" stroke-linejoin="round"/><rect width="4.924243" height="16.212121" rx="0" ry="0" transform="translate(7.825757 2.196971)" stroke-width="0"/><rect width="4.924243" height="16.212121" rx="0" ry="0" transform="matrix(0-1 1 0 2.181818 12.765153)" stroke-width="0"/></svg>-->
</g>

<g id="lean-di-icons:new-file">
<svg stroke="${DEFAULT_LD_COMPONENTS_COLOR}" id="eeiYugExZRy1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-8 0 32 32" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M13.52,5.72h-7.4c-.36,0-.56.2-.6.24L0.24,11.24c-.04.04-.24.24-.24.56L0,24c0,1.24,1,2.24,2.24,2.24h11.24c1.24,0,2.24-1,2.24-2.24v-16.04c.04-1.24-.96-2.24-2.2-2.24ZM5.28,8.56v1.8c0,.32-.24.56-.56.56h-1.84l2.4-2.36Zm8.8,15.48c0,.32-.28.56-.56.56h-11.28c-.32,0-.56-.28-.56-.56v-11.36h3.04c1.24,0,2.24-1,2.24-2.24v-3.04h6.52c.32,0,.56.24.56.56l.04,16.08Z" transform="matrix(1.238088 0 0 1.238088-1.87151-3.804646)"/></svg>

</g>

<g id="lean-di-icons:cube">
<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{stroke-width: 4; fill: none;stroke:${DEFAULT_LD_COMPONENTS_COLOR};stroke-linecap:round;stroke-linejoin:round;}</style></defs><polygon class="a" points="40.86 14.3 23.89 4.5 7.03 14.23 24 24.03 40.86 14.3"/><polygon class="a" points="24 24.03 7.03 14.23 7.03 33.7 24 43.5 24 24.03"/><polygon class="a" points="40.86 14.3 24 24.03 24 43.5 40.86 33.77 40.86 14.3"/></svg>
</g>

<g id="lean-di-icons:cubes">
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8" d="M6.5,10.5 L12,13.5 L17.5,10.5 L17.5,4.5 L12,1.5 L6.5,4.5 L6.5,10.5 Z M6.5,4.5 L12,7.5 L17.5,4.5 M12,7.5 L12,13.5 L12,7.5 Z M1,19.5 L6.5,22.5 L12,19.5 L12,13.5 L6.5,10.5 L1,13.5 L1,19.5 Z M1,13.5 L6.5,16.5 L12,13.5 M6.5,16.5 L6.5,22.5 L6.5,16.5 Z M12,19.5 L17.5,22.5 L23,19.5 L23,13.5 L17.5,10.5 L12,13.5 L12,19.5 Z M12,13.5 L17.5,16.5 L23,13.5 M17.5,16.5 L17.5,22.5 L17.5,16.5 Z"/>
</svg>
</g>

<g id="lean-di-icons:floppy">
<svg id="eqH5kFGaXAM1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 -0.5 21 21" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><g transform="matrix(.849531 0 0 0.849531 1.579924 1.50469)"><g transform="translate(-419-640)"><g transform="translate(56 160)"><path d="M370.21875,484c0-.552.4704-1,1.05-1s1.05.448,1.05,1-.4704,1-1.05,1-1.05-.448-1.05-1v0ZM381.9,497c0,.552-.4704,1-1.05,1h-1.05v-4c0-1.105-.93975-2-2.1-2h-8.4c-1.16025,0-2.1.895-2.1,2v4h-1.05c-.5796,0-1.05-.448-1.05-1v-9.956c0-.133.05565-.26.1533-.353l1.9467-1.854v1.163c0,1.105.93975,2,2.1,2h8.4c1.16025,0,2.1-.895,2.1-2v-4h1.05c.5796,0,1.05.448,1.05,1v14Zm-4.2,1h-8.4v-3c0-.552.4704-1,1.05-1h6.3c.5796,0,1.05.448,1.05,1v3Zm-8.4-15.163l.87885-.837h7.52115v3c0,.552-.4704,1-1.05,1h-6.3c-.5796,0-1.05-.448-1.05-1v-2.163ZM381.9,480h-12.1653c-.27825,0-.54495.105-.74235.293l-5.6847,5.414c-.1974.188-.30765.442-.30765.707v11.586c0,1.105.93975,2,2.1,2h16.8c1.16025,0,2.1-.895,2.1-2v-16c0-1.105-.93975-2-2.1-2v0Z" fill-rule="evenodd"/></g></g></g></svg>
</g>

<g id="lean-di-icons:download-domain">
<svg id="e96oCY1zBm01" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><polygon points="40.86,14.3 23.89,4.5 7.03,14.23 24,24.03 40.86,14.3" transform="matrix(.669256 0 0 0.669256 7.919665-.887997)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><polygon points="24,24.03 7.03,14.23 7.03,33.7 24,43.5 24,24.03" transform="matrix(.669256 0 0 0.669256 7.882857-.864572)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><polygon points="40.86,14.3 24,24.03 24,43.5 40.86,33.77 40.86,14.3" transform="matrix(.669256 0 0 0.669256 7.919666-.911421)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><line x1="0" y1="-4.089699" x2="0" y2="8.44697" transform="matrix(1 0 0 0.991036 24 36.098486)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="3" stroke-linecap="round"/><line x1="11.265466" y1="1.719957" x2="0" y2="8.522689" transform="matrix(1 0 0 0.991036 24 36.098486)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="3" stroke-linecap="round"/><line x1="-11.375465" y1="1.719953" x2="0" y2="8.522689" transform="matrix(1 0 0 0.991036 24 36.098486)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="3" stroke-linecap="round"/></svg>
</g>

<g id="lean-di-icons:database">
<svg cache-id="6d51c7aaa02f475a92a1052639cac343" id="eKvODgiM45E1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M12,1.25c-2.487,0-4.774.402-6.466,1.079-.844.337-1.577.758-2.112,1.264C2.886,4.1,2.5,4.744,2.5,5.5v12.987l.026.013h-.026c0,.756.386,1.4.922,1.907.535.506,1.268.927,2.112,1.264C7.226,22.348,9.513,22.75,12,22.75s4.773-.402,6.466-1.079c.844-.337,1.577-.758,2.112-1.264.536-.507.922-1.151.922-1.907h-.026l.026-.013v-12.987c0-.756-.386-1.4-.922-1.907-.535-.506-1.268-.927-2.112-1.264C16.773,1.652,14.487,1.25,12,1.25ZM4,5.5c0-.21.104-.487.453-.817.35-.332.899-.666,1.638-.962C7.566,3.131,9.655,2.75,12,2.75s4.434.382,5.909.971c.74.296,1.287.63,1.638.962.35.33.453.606.453.817c0,.21-.104.487-.453.817-.35.332-.899.666-1.638.962-1.475.59-3.564.971-5.909.971s-4.434-.382-5.909-.971c-.74-.296-1.287-.63-1.638-.962C4.103,5.987,4,5.711,4,5.5ZM20,12v-4.129c-.480263.322427-.994726.590726-1.534.8C16.773,9.348,14.487,9.75,12,9.75s-4.774-.402-6.466-1.079c-.539271-.209281-1.053733-.47758-1.534-.8L4,12c0,.21.104.487.453.817.35.332.899.666,1.638.961c1.475.59,3.564.972,5.909.972s4.434-.382,5.909-.972c.74-.295,1.287-.629,1.638-.96.35-.33.453-.607.453-.818ZM4,14.371c.443.305.963.572,1.534.8C7.226,15.848,9.513,16.25,12,16.25s4.773-.402,6.466-1.079c.539274-.209274,1.053737-.477573,1.534-.8v4.116l.013.013h-.013c0,.21-.104.487-.453.817-.35.332-.899.666-1.638.962-1.475.59-3.564.971-5.909.971s-4.434-.382-5.909-.971c-.74-.296-1.287-.63-1.638-.962-.35-.33-.453-.606-.453-.817h-.013L4,18.487v-4.117Z" transform="matrix(.758683 0 0 0.758683 7.024611 5.85037)" fill-rule="evenodd"/><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(.645568 0 0 0.820609 3.761366 0.719697)" stroke-width="0"/><rect width="2.992424" height="10.030303" rx="0" ry="0" transform="matrix(0-.645568 0.820609 0 0.611795 5.801082)" stroke-width="0"/></svg>
</g>

<g id="lean-di-icons:folder-o">

<svg stroke="${DEFAULT_LD_COMPONENTS_COLOR}" id="eAX2Ucsldu61" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M11.5,8.5h8v10h-14v-13h5l1,3Zm0,0h-6" transform="matrix(.921571 0 0 0.921571 4.765054 5.585574)" fill="none" stroke-width="1.8"/><rect width="1.93" height="8.23" rx="0" ry="0" transform="translate(3.76 0.720001)" stroke-width="0"/><rect width="1.93" height="8.23" rx="0" ry="0" transform="matrix(0 1-1 0 8.84 3.870001)" stroke-width="0"/></svg>
</g>

<g id="lean-di-icons:groups">



<svg id="eZyn4GFXzmW1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M6.833047,3h-4v18h4" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.073591,7.898055c0,.389882-.316084.705967-.705966.705967s-.705967-.316085-.705967-.705967.316071-.705967.705967-.705967.705966.316085.705966.705967Z" transform="translate(.000005 0)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.465272,9.739574v-3.683038c0-.508522-.594479-.92076-1.327851-.92076h-6.753169c-.352167,0-.689914.097007-.938931.269686L9.789617,7.246987c-.51856.359556-.51856.94258,0,1.302136l2.655704,1.84152c.249017.172689.586764.269691.938931.269691h6.753169c.733372,0,1.327851-.412224,1.327851-.92076Z" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.387542,16.146066c0,.389882-.316084.705967-.705966.705967s-.705967-.316085-.705967-.705967.316071-.705967.705967-.705967.705966.316085.705966.705967Z" transform="translate(-.313951 0)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.779223,17.987585v-3.683038c0-.508522-.594479-.92076-1.327851-.92076h-6.753169c-.352167,0-.689914.09701-.938931.269686l-2.655705,1.841525c-.518559.359556-.518559.94258,0,1.302136l2.655705,1.84152c.249017.172689.586764.269691.938931.269691h6.753169c.733372,0,1.327851-.412224,1.327851-.92076Z" transform="translate(-.313951 0)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>

</g>

<g id="lean-di-icons:props">
<svg viewBox="0 0 32 32" enable-background="new 0 0 32 32" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

<g id="Layer_1"/>

<g id="Layer_2">

<g>

<polygon fill="none" points="    2,20 18,4 28,4 28,14 12,30   " stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>

<circle cx="23" cy="9" fill="none" r="2" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/>

<line fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="24" x2="30" y1="8" y2="2"/>

<line fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="17" x2="9" y1="11" y2="19"/>

<line fill="none" stroke=${DEFAULT_LD_COMPONENTS_COLOR} stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="21" x2="17" y1="15" y2="19"/>

</g>

</g>

</svg></g>

<g id="lean-di-icons:two-bases">


<svg id="eq3rChgwKLb1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><g transform="translate(1.01205 1.01205)"><ellipse rx="5.28992" ry="2.19589" transform="translate(15.2147 3.47608)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/><path d="M20.504618,12.259654c0,.288394-.136857.573933-.402638.840368s-.655497.508423-1.146779.712348-1.074308.36569-1.716126.475997-1.329658.167181-2.024376.167181-2.064141-.0568-2.705945-.167181" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/><path d="M20.504618,3.476077v8.783577" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/><path d="M9.924779,3.476077v2.938482" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/></g><g transform="translate(-.351119 1.21859)"><ellipse rx="5.28992" ry="2.19589" transform="translate(8.53012 8.08325)" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/><path d="M13.82004,16.866832c0,.288394-.136857.573933-.402638.840368s-.655497.508423-1.146779.712348-1.074308.36569-1.716126.475997-1.329658.167181-2.024376.167181-1.382558-.0568-2.024362-.167181-1.224965-.272071-1.716179-.475997-.880862-.445986-1.146711-.712348-.402669-.551974-.402669-.840368" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/><path d="M13.82004,8.083254v8.783578" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/><path d="M3.2402,8.083254v8.783578" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1.8"/></g></svg>

</g>

<g id="lean-di-icons:explode">

<svg  xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 1144.000000 1280.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}" stroke-width="1000">
<path d="M829 12748 c35 -80 208 -473 1050 -2377 463 -1046 841 -1904 839
-1905 -2 -2 -149 25 -328 60 -1104 213 -2003 385 -2005 382 -1 -2 375 -619
836 -1373 461 -753 839 -1371 839 -1371 0 -1 -461 -606 -1025 -1345 -564 -739
-1025 -1347 -1025 -1350 0 -4 199 34 443 83 2948 595 2827 571 2834 565 2 -3
-48 -915 -112 -2028 -64 -1112 -115 -2035 -113 -2049 2 -22 213 259 1203 1611
660 901 1202 1638 1205 1638 3 1 392 -572 865 -1273 473 -701 862 -1272 864
-1271 3 4 65 519 271 2250 55 468 104 864 108 882 l7 32 1725 -799 c949 -440
1740 -807 1759 -815 33 -16 34 -16 20 1 -8 10 -560 675 -1227 1478 -667 802
-1211 1460 -1210 1462 2 1 296 7 653 13 1486 26 1759 30 1938 33 103 1 187 4
186 7 0 3 -516 339 -1146 746 -630 407 -1155 747 -1166 756 -19 14 15 59 849
1108 478 601 871 1097 872 1102 3 6 -28 8 -85 4 -48 -3 -225 -10 -393 -15
-168 -6 -435 -15 -595 -21 -159 -5 -587 -20 -950 -33 -363 -13 -661 -23 -663
-21 -1 1 361 753 804 1671 444 918 826 1711 851 1763 l43 93 -62 -53 c-2125
-1842 -3084 -2666 -3089 -2656 -4 7 -87 217 -184 467 -349 897 -795 2040 -892
2289 l-57 144 -42 -149 c-23 -82 -122 -432 -219 -779 -97 -346 -222 -790 -276
-985 -55 -195 -137 -485 -181 -645 -45 -159 -84 -293 -87 -297 -4 -4 -892 672
-1975 1502 -1082 831 -1969 1510 -1971 1510 -3 0 4 -19 14 -42z"/>
</g>
</svg>
</g>

<g id="lean-di-icons:area">


<svg id="eZKAY7MoG2W1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path stroke-width="1.3" d="M21.8,15.66c0,3.479-1.171,5.845587-4.554,5.845587-3.743,0-5.346-2.48-8.699-2.042587-.844,0-1.535.154-2.22.154-1.137-.154-2.222851-.358978-3.039342-1.135088s-1.281462-1.851428-1.287658-2.977912c0-2.329,2.956-2.756,3.19-7.521C5.373,4.254,8.23,2.2,11.565,2.2C17.521,2.2,21.8,8.757,21.8,15.66Zm-1,0c0-6.373969-3.711-12.590774-9.235-12.590774-2.37,0-5.681714,1.395774-5.857714,4.962774c0,1.922914-.371352,3.621304-1.790286,5.192129C3.314,13.969129,3,14.91,3,15.504c0,3.077,3.293,3.113,3.326,3.113.297622-.006308.594703-.028338.89-.066.441403-.053498.885396-.082875,1.33-.088c1.560091.056128,3.086962.466485,4.465,1.2c1.305327.699935,2.754633,1.08904,4.235,1.137.879,0,3.554,0,3.554-5.14Z" fill="none" stroke="${DEFAULT_LD_COMPONENTS_COLOR}"/><path d="M17.246,20.8c-1.480367-.04796-2.929673-.437065-4.235-1.137-1.377737-.733369-2.904249-1.143721-4.464-1.2-.444938.005089-.889265.034466-1.331.088-.295297.037662-.592378.059692-.89.066C6.293,18.617,3,18.58,3,15.504c0-.594.314-1.01.917-1.756c1.418934-1.570825,2.225376-3.599708,2.272-5.716C6.364,4.465,9.194,3.2,11.565,3.2c5.524,0,9.235,6.443,9.235,12.46c0,5.14-2.675,5.14-3.554,5.14Z" opacity="0.25" fill="#bed9fc"/><path d="M0,0h24v24h-24Z" fill="none"/></svg>

</g>

</vaadin-iconset>`;

    return template;

}