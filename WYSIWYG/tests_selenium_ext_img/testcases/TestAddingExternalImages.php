<?php

require_once dirname(__FILE__) . '/../../../../tests/tests_halo/SeleniumTestCase_Base.php';

class TestAddingExternalImages extends SeleniumTestCase_Base
{

  public function testWithExternalImagesAllowed()
  {
    $this->open("/mediawiki/index.php?title=Mynewtestpage2&action=edit&mode=wysiwyg");
    $this->runScript("CKEDITOR.instances.wpTextbox1.setData(\"\")");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: //a[contains(@class, 'cke_button_image')]/span[1]");
        try {
            if ($this->isElementPresent("//a[contains(@class, 'cke_button_image')]/span[1]")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->click("//a[contains(@class, 'cke_button_image')]/span[1]");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: //input[@class='cke_dialog_ui_input_text'][@type='text']");
        try {
            if ($this->isElementPresent("//input[@class='cke_dialog_ui_input_text'][@type='text']")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    $this->type("//input[@class='cke_dialog_ui_input_text'][@type='text']", "http://www.google.de/intl/en_com/images/srpr/logo1w.png");
    $this->click("//span[@class='cke_dialog_ui_button'][text()='OK']");
    $this->click("wpSave");
    $this->waitForPageToLoad("30000");
    try {
        $this->assertTrue($this->isElementPresent("//img[@alt='logo1w.png']"), "Element not present: //img[@alt='logo1w.png']");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}
?>