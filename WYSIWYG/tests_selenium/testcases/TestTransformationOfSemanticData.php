<?php

require_once dirname(__FILE__) . '/../../../../tests/tests_halo/SeleniumTestCase_Base.php';


class TestTransformationOfSemanticData extends SeleniumTestCase_Base
{

	public function testMyTestCase()
	{
		$this->open("/mediawiki/index.php?title=Helium&action=edit&mode=wikitext");
		$this->type("wpTextbox1", "Helium");
		$this->type("wpTextbox1", "Helium is the chemical element with atomic number 2, which is represented by the symbol He.It is a  [[has color::none|colorless]], [[smells like::odorless]], tasteless, non-toxic, inert monatomic gas that heads the noble gas group in the periodic table.");
		$this->click("wpSave");
		$this->waitForPageToLoad("30000");
		$this->click("link=Edit");
		$this->waitForPageToLoad("30000");
		for ($second = 0; ; $second++) {
			if ($second >= 60) $this->fail("Element not present: //span[@class='fck_mw_property'][@property='has color::none'][text()='colorless']");
			try {
				if ($this->isElementPresent("//span[@class='fck_mw_property'][@property='has color::none'][text()='colorless']")) break;
			} catch (Exception $e) {}
			sleep(1);
		}

		try {
			$this->assertTrue($this->isElementPresent("//span[@class='fck_mw_property'][@property='has color::none'][text()='colorless']"), "Element not present: //span[@class='fck_mw_property'][@property='has color::none'][text()='colorless']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		try {
			$this->assertTrue($this->isElementPresent("//span[@class='fck_mw_property'][@property='smells like'][text()='odorless']"), "Element not present: //span[@class='fck_mw_property'][@property='smells like'][text()='odorless']");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
		$this->click("toggle_wpTextbox1");
		for ($second = 0; ; $second++) {
			if ($second >= 60) $this->fail("Text not present: Helium is the chemical element with atomic number 2, which is represented by the symbol He.It is a [[has color::none|colorless]], [[smells like::odorless]], tasteless, non-toxic, inert monatomic gas that heads the noble gas group in the periodic table.");
			try {
				if ($this->isTextPresent("Helium is the chemical element with atomic number 2, which is represented by the symbol He.It is a [[has color::none|colorless]], [[smells like::odorless]], tasteless, non-toxic, inert monatomic gas that heads the noble gas group in the periodic table.
            ")) break;
			} catch (Exception $e) {}
			sleep(1);
		}

		try {
			$this->assertTrue($this->isTextPresent("Helium is the chemical element with atomic number 2, which is represented by the symbol He.It is a [[has color::none|colorless]], [[smells like::odorless]], tasteless, non-toxic, inert monatomic gas that heads the noble gas group in the periodic table."),
			"Text not present: Helium is the chemical element with atomic number 2, which is represented by the symbol He.It is a [[has color::none|colorless]], [[smells like::odorless]], tasteless, non-toxic, inert monatomic gas that heads the noble gas group in the periodic table.");
		} catch (PHPUnit_Framework_AssertionFailedError $e) {
			array_push($this->verificationErrors, $e->toString());
		}
	}
}
?>