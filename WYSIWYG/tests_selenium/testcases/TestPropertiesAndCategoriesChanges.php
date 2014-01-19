<?php

require_once dirname(__FILE__) . '/../../../../tests/tests_halo/SeleniumTestCase_Base.php';


class TestPropertiesAndCategoriesChanges extends SeleniumTestCase_Base
{

	public function testMyTestCase()
	{
		$this->open("/mediawiki/index.php?title=Mynewtestpage&action=edit&mode=wysiwyg");
		$this->click("//a/img[@id='editimage']");
		$this->waitForPageToLoad("30000");
		$this->setSpeed("2000");
		$this->click("toggle_wpTextbox1");
		$this->type("wpTextbox1", "This is Berlin located in [[located in::Germany]]. The city is also is [[is capital::Germany]] of Germany and has [[Inhabitants::3524000|3.5 Mio]]. [[Category:City]]");
		$this->click("toggle_wpTextbox1");
		try {
			$this->assertTrue($this->isElementPresent("//span[@property='located in'][@class='fck_mw_property'][text()='Germany']"), "Element not present: //span[@property='located in'][@class='fck_mw_property'][text()='Germany']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		try {
			$this->assertTrue($this->isElementPresent("//span[@property='is capital'][@class='fck_mw_property'][text()='Germany']"), "Element not present: //span[@property='is capital'][@class='fck_mw_property'][text()='Germany']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		try {
			$this->assertTrue($this->isElementPresent("//span[@property='Inhabitants::3524000'][@class='fck_mw_property'][text()='3.5 Mio']"), "Element not present: //span[@property='Inhabitants::3524000'][@class='fck_mw_property'][text()='3.5 Mio']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		try {
			$this->assertTrue($this->isElementPresent("//span[@class='fck_mw_category'][@sort='City'][@_fcknotitle='true'][text()='City']"), "Element not present: //span[@class='fck_mw_category'][@sort='City'][@_fcknotitle='true'][text()='City']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		$this->click("toggle_wpTextbox1");
		$this->type("wpTextbox1", "This is Berlin located in [[located in::Germany]]. The city is also is Germany of Germany and has [[Inhabitants::3524000]]. [[Category:Person]]");
		$this->click("toggle_wpTextbox1");
		try {
			$this->assertTrue($this->isElementPresent("//span[@property='located in'][@class='fck_mw_property'][text()='Germany']"), "Element not present: //span[@property='located in'][@class='fck_mw_property'][text()='Germany']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		try {
			$this->assertTrue($this->isElementPresent("//span[@property='Inhabitants'][@class='fck_mw_property'][text()='3524000']"), "Element not present: //span[@property='Inhabitants'][@class='fck_mw_property'][text()='3524000']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		try {
			$this->assertTrue($this->isElementPresent("//span[@class='fck_mw_category'][@sort='Person'][@_fcknotitle='true'][text()='Person']"), "Element not present: //span[@class='fck_mw_category'][@sort='Person'][@_fcknotitle='true'][text()='Person']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
	}
}
?>