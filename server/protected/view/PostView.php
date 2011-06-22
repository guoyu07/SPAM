<?php

include_once 'protected/module/arc/ARC2.php';

class PostView {
    /* prende in input il post come array e lo ritorna in html+rdfa */

    public static function renderPost($p, $userID=null, $postID=null) {
        //Definisco template di un articolo HTML standard da inviare
        $key = key($p);
        $articleTemplate = '<article prefix="
   sioc: http://rdfs.org/sioc/ns#
   ctag: http://commontag.org/ns#
   skos: http://www.w3.org/2004/02/skos/core#
   dcterms: http://purl.org/dc/terms/
   tweb: http://vitali.web.cs.unibo.it/vocabulary/"
    about="%POSTID%" typeof="sioc:Post" rel="sioc:has_creator" resource="%USERID%"
   property="dcterms:created" content="%POSTDATE%">
   %POSTCONTENT%
   %USERLIKE%
   <span property="tweb:countLike" content="%LIKEVALUE%" />
   <span property="tweb:countDislike" content="%DISLIKEVALUE%" />
</article>';
        //Identifico array delle variabili del template da sostituire
        $article_vars = array("%POSTID%", "%USERID%", "%POSTDATE%", "%POSTCONTENT%", "%USERLIKE%", "%LIKEVALUE%", "%DISLIKEVALUE%");
        //Controllo se l'utente ha un preferenza di like o dislike
        $userPref = '';
        if (isset($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/like'])) {
            foreach ($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/like'] as $likeUser) {
                if ($likeUser == "spam:/Spammers/" . $userID) {
                    $userPref = '<span rev="tweb:like" resource="/Spammers/' . $userID . '" />';
                    break;
                }
            }
        }
        if (isset($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/dislike'])) {
            foreach ($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/dislike'] as $dislikeUser) {
                if ($dislikeUser == "spam:/Spammers/" . $userID) {
                    $userPref = '<span rev="tweb:dislike" resource="/Spammers/' . $userID . '" />';
                    break;
                }
            }
        }
//Specifico array con i valori da inserire
        $article_values = array(
            "/Spammers/" . $userID . '/' . $postID,
            "/Spammers/" . $userID,
            $p[$key]['http://purl.org/dc/terms/created'][0],
            htmlspecialchars_decode($p[$key]['http://rdfs.org/sioc/ns#content'][0]),
            $userPref,
            $p[$key]['http://vitali.web.cs.unibo.it/vocabulary/countLike'][0],
            $p[$key]['http://vitali.web.cs.unibo.it/vocabulary/countDislike'][0],
        );
        $article_html = str_replace($article_vars, $article_values, $articleTemplate);
        return $article_html;
    }

    public static function renderPostRdf($p) {
        $ns = array(
            'sioc' => 'http://rdfs.org/sioc/ns#',
            'dcterms' => 'http://purl.org/dc/terms/',
            'ctag' => 'http://commontag.org/ns#',
            'skos' => 'http://www.w3.org/2004/02/skos/core#',
            'tweb' => 'http://vitali.web.cs.unibo.it/vocabulary/',
            'spam' => 'http://ltw1102.web.cs.unibo.it/'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        $rdfxml = $ser->getSerializedIndex($p);
        return $rdfxml;
    }

    /* il parametro $m è un array multiplo di post */

    public static function renderMultiplePost($m) {
        $dom = new DOMDocument('1.0', 'utf-8');
        $archive = $dom->appendChild($dom->createElement('archive'));
        /* $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><archive></archive>'); */
        foreach ($m as $post) {
//            $myPost = $xml->addChild('post');
//            $myPost->addChild('content', 'text/html; charset=UTF8');
//            $myPost->addChild('affinity', rand(3, 13));
            $myPost = $archive->appendChild($dom->createElement('post'));
            $myPost->appendChild($dom->createElement('content', 'text/html; charset=UTF8'));
            $myPost->appendChild($dom->createElement('affinity', rand(1, 20)));
            $content = self::renderPost($post);
            //$myPost->addChild(self::renderPost($post));

            $article = $dom->createTextNode($content);
            $myPost->appendChild($article);
            ;
        }
        return $dom->saveXML();
    }

}

?>