<?php

require_once dirname(__FILE__) . '/../../../../tests/tests_halo/SeleniumTestCase_Base.php';

class TestAutocompletetion extends SeleniumTestCase_Base
{

  public function test_autocompletetion()
  {
    $this->open("/mediawiki/index.php?title=MyNewTestPage&action=edit");
    $this->type("wpTextbox1", "[[");
    $this->controlKeyDown();
    $this->altKeyDown();
    $this->typeKeys("wpTextbox1", "' '");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: //*[@id=\"selected0\" and text()='Affiliation']");
        try {
//            if ($this->isElementPresent("//*[@id=\"selected0\" and text()='Affiliation']")) break;
			if ($this->isElementPresent("id=selected0")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    try {
        $this->assertTrue($this->isElementPresent("id=selected0"), "Element not present: id=selected0");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isElementPresent("id=selected1"), "Element not present: id=selected1");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isElementPresent("id=selected2"), "Element not present: id=selected2");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    try {
        $this->assertTrue($this->isElementPresent("id=selected3"), "Element not present: id=selected3");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
    $this->altKeyUp();
    $this->controlKeyUp();
    $this->type("wpTextbox1", "");
    $this->type("wpTextbox1", "{{");
    $this->controlKeyDown();
    $this->altKeyDown();
    $this->typeKeys("wpTextbox1", "' '");
    for ($second = 0; ; $second++) {
        if ($second >= 60) $this->fail("Element not present: id=ac_toomuchresults");
        try {
            if ($this->isElementPresent("id=ac_toomuchresults")) break;
        } catch (Exception $e) {}
        sleep(1);
    }

    try {
        $this->assertTrue($this->isElementPresent("id=ac_toomuchresults"), "Element not present: id=ac_toomuchresults");
    } catch (PHPUnit_Framework_AssertionFailedError $e) {
        array_push($this->verificationErrors, $e->toString());
    }
  }
}
?>