<?php
class Example extends PHPUnit_Extensions_SeleniumTestCase
{
  protected function setUp()
  {
    $this->setBrowser("*chrome");
    $this->setBrowserUrl("http://localhost/");
  }

  public function testMyTestCase()
  {
    $this->open("/mediawiki/index.php?title=Mynewtestpagss&action=edit&mode=wysiwyg");
    $this->runScript("CKEDITOR.instances.wpTextbox1.setData(\"This page is called: {{{PAGENAME}}}<br/><br/>Template Call: 2 < 3<br/>{{template|sdf|param=2|pagea2={{Some Other template}}}} and a nowiki part&lt;nowiki&gt;bla<br/>blub done<br/>&lt;/nowiki&gt;<br/><br/>Tepmplates like this {{TempLateBlub|param1={{{arg_x}}}}} can also use parameters.<br/><br/>Here we have magic words like __SGDGfsar__ and __NOTOC__ and __SOFOR__ that should be<br/>replaced.<br/><br/>We have {{#ask:[[Category:Person]]|format=ol}} in the wiki.\")");
    $this->setSpeed("1000");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("//a[@title='Paragraph Format']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("//a[@title='Paragraph Format']");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("//a/p[text()='Normal']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("//a/p[text()='Normal']");
    $this->setSpeed("0");
    $this->click("wpSave");
    $this->waitForPageToLoad("30000");
    $this->verifyTextPresent("This page is called: {{{PAGENAME}}}");
    $this->verifyTextPresent("Template Call: 2 < 3");
    $this->verifyTextPresent("{{template|sdf|param=2|pagea2={{Some Other template}}}} and a nowiki part<nowiki>bla");
    $this->verifyTextPresent("blub done");
    $this->verifyTextPresent("</nowiki>");
    $this->verifyTextPresent("Tepmplates like this {{TempLateBlub|param1={{{arg_x}}}}} can also use parameters.");
    $this->verifyTextPresent("Here we have magic words like __SGDGfsar__ and __NOTOC__ and __SOFOR__ that should be");
    $this->verifyTextPresent("replaced.");
    $this->verifyTextPresent("We have {{#ask:[[Category:Person]]|format=ol}} in the wiki.");
    $this->click("//div[@id='ca-edit']/a");
    $this->waitForPageToLoad("30000");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("timeout");
        try {
            if ($this->isElementPresent("//a[contains(@class, 'cke_button_source')]")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("//a[contains(@class, 'cke_button_source')]");
    $this->verifyTextPresent("");
  }
}
?>