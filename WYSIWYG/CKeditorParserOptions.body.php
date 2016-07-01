<?php

class CKeditorParserOptions extends ParserOptions {
	function getNumberHeadings() { return false; }
	function getEditSection() { return false; }

	function getSkin( $title = null ) {
		if ( !isset( $this->mSkin ) ) {
			// $this->mSkin = new CKeditorSkin( $this->mUser->getSkin() );         // 27.06.16 RL: < MW 1.27
			$this->mSkin = new CKeditorSkin(RequestContext::getMain()->getSkin()); // 27.06.16 RL: >= MW 1.27
		}
		return $this->mSkin;
	}
}
