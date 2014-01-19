<?php

class CKeditorParserOptions extends ParserOptions {
	function getNumberHeadings() { return false; }
	function getEditSection() { return false; }

	function getSkin( $title = null ) {
		if ( !isset( $this->mSkin ) ) {
			$this->mSkin = new CKeditorSkin( $this->mUser->getSkin() );
		}
		return $this->mSkin;
	}
}
