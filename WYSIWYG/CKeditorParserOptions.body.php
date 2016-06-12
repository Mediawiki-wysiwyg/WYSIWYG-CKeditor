<?php

class CKeditorParserOptions extends ParserOptions {
	function getNumberHeadings() { return false; }
	function getEditSection() { return false; }

	function getSkin( $title = null ) {
		if ( !isset( $this->mSkin ) ) {
			$this->mSkin = new CKeditorSkin(RequestContext::getMain()->getSkin());
		}
		return $this->mSkin;
	}
}
