<?php

require_once dirname(__FILE__) . '/../../../../tests/tests_halo/SeleniumTestCase_Base.php';

class TestWikiMarkup extends SeleniumTestCase_Base
{

  public function testMyTestCase()
  {
    $this->open("/mediawiki/index.php?title=Mynewtestpagss&action=edit&mode=wysiwyg");
    $this->runScript("CKEDITOR.instances.wpTextbox1.setData(\"This page is called: {{{PAGENAME}}}<br/><br/>Template Call: 2 < 3<br/>{{template|sdf|param=2|pagea2={{Some Other template}}}} and a nowiki part&lt;nowiki&gt;bla<br/>blub done<br/>&lt;/nowiki&gt;<br/><br/>Tepmplates like this {{TempLateBlub|param1={{{arg_x}}}}} can also use parameters.<br/><br/>Here we have magic words like __SGDGfsar__ and __NOTOC__ and __SOFOR__ that should be<br/>replaced.<br/><br/>We have {{#ask:[[Category:Person]]|format=ol}} in the wiki.\")");
    $this->setSpeed("1000");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: //a[@title='Paragraph Format']");
        try {
            if ($this->isElementPresent("//a[@title='Paragraph Format']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("//a[@title='Paragraph Format']");
  	for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: //a/p[text()='Normal']");
        try {
            if ($this->isElementPresent("//a/p[text()='Normal']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }
    
    $this->click("//a/p[text()='Normal']");
    $this->setSpeed("0");
    $this->click("wpSave");
    $this->waitForPageToLoad("30000");
    try {
        $this->assertTrue($this->isTextPresent("This page is called: {{{PAGENAME}}}"), "Text not present: This page is called: {{{PAGENAME}}}");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("Template Call: 2 < 3"), "Text not present: Template Call: 2 < 3");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("{{template|sdf|param=2|pagea2={{Some Other template}}}} and a nowiki part<nowiki>bla"), "Text not present: {{template|sdf|param=2|pagea2={{Some Other template}}}} and a nowiki part<nowiki>bla");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("blub done"), "Text not present: blub done");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("</nowiki>"), "Text not present: </nowiki>");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("Tepmplates like this {{TempLateBlub|param1={{{arg_x}}}}} can also use parameters."), "Text not present: Tepmplates like this {{TempLateBlub|param1={{{arg_x}}}}} can also use parameters.");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("Here we have magic words like __SGDGfsar__ and __NOTOC__ and __SOFOR__ that should be"), "Text not present: Here we have magic words like __SGDGfsar__ and __NOTOC__ and __SOFOR__ that should be");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("replaced."), "Text not present: replaced");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isTextPresent("We have {{#ask:[[Category:Person]]|format=ol}} in the wiki."), "Text not present: We have {{#ask:[[Category:Person]]|format=ol}} in the wiki.");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->click("//a/img[@id='editimage']");
    $this->waitForPageToLoad("30000");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: //a[contains(@class, 'cke_button_source')]");
        try {
            if ($this->isElementPresent("//a[contains(@class, 'cke_button_source')]")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("//a[contains(@class, 'cke_button_source')]");
  	try {
        $this->assertTrue(false !== strpos(strtolower($this->getValue("//td[@id='cke_contents_wpTextbox1']/textarea")), strtolower("This page is called: &#x7B;&#x7B;&#x7B;PAGENAME&#x7D;&#x7D;&#x7D;<br/><br/>Template Call: 2 < 3<br/>&#x7B;&#x7B;template|sdf|param=2|pagea2=&#x7B;&#x7B;Some Other template&#x7D;&#x7D;&#x7D;&#x7D; and a nowiki part&lt;nowiki&gt;bla<br/>blub done<br/>&lt;/nowiki&gt;<br/><br/>Tepmplates like this &#x7B;&#x7B;TempLateBlub|param1=&#x7B;&#x7B;&#x7B;arg_x&#x7D;&#x7D;&#x7D;&#x7D;&#x7D; can also use parameters.<br/><br/>Here we have magic words like __SGDGfsar__ and &#95;&#95;NOTOC&#95;&#95; and __SOFOR__ that should be<br/>replaced.<br/><br/>We have &#x7B;&#x7B;#ask:&#x5B;&#x5B;Category:Person&#x5D;&#x5D;|format=ol&#x7D;&#x7D; in the wiki.")));
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}
?>