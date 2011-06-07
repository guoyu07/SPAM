<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SRVModel
 *
 * @author clem
 */
class SRVModel {
    static private $_SERVERSBASE =
        "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/ServerFederatiGiusta.xml";
    private $serverList;
    
    function __construct() {
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $request->connect_to(self::$_SERVERSBASE)->get();
        $this->serverList = $request->xml_result();
    }
    
    public static function getDefaults(){
        $idsServer = array();
        foreach ($this->serverList->server as $myServer)
            array_push($idsServer, (string) $myServer->attributes()->serverID);
        print_r($idsServer);
        return $idsServer;
    }
    
    /* questa mi serve per ritornare l'indirizzo del server.
     * 
     * @param $s = serverID
     */
    public static function getUrl($s){
        while(list(, $server) = each($this->serverList->server)) {
            if($server->attributes()->serverID == $s) {
                return $server->attributes()->serverURL;
            }
        }                
    }
    
}

?>
