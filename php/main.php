<?php

if( !isset( $_GET['func'] ) ) return;

//-------------------------------------------------
class foo {
    private $a;
    public $b = 1;
    public $c;
    private $d;
    static $e;
   
    public function test() {
        var_dump(get_object_vars($this));
    }
}

class RiotApi
{
	public function GetMatchDetails()
	{
		$gameRealm = $_GET['realm'];
		$gameId = $_GET['id'];
		$gameHash = $_GET['hash'];

		$url = "https://acs.leagueoflegends.com/v1/stats/game/" . $gameRealm . "/" . $gameId . "?gameHash=" . $gameHash;

		$json = file_get_contents($url);
		$json = json_decode($json, true);
		$index = array('index' => intval($_GET['index']));
		$json = array_merge($json, $index);
		
		return json_encode($json);
	}

	public function GetMatchTimeline()
	{
		$gameRealm = $_GET['realm'];
		$gameId = $_GET['id'];
		$gameHash = $_GET['hash'];

		$url = "https://acs.leagueoflegends.com/v1/stats/game/" . $gameRealm . "/" . $gameId . "/timeline?gameHash=" . $gameHash;

		$json = file_get_contents($url);
		
		return $json;
	}

	public function GetChampionImage()
	{
		$json = file_get_contents('../data/json/champions.json');
		
		return $json;
	}

	public function GetItem()
	{
		$json = file_get_contents('../data/json/items.json');
		
		return $json;
	}

	public function GetRealms()
	{
		$json = file_get_contents('../data/json/realms.json');
		
		return $json;
	}

	public function GetSpells()
	{
		$json = file_get_contents('../data/json/summoner-spells.json');
		
		return $json;
	}
}

//-------------------------------------------------

$api = new RiotApi;

$func_tbl = array(
			"GetMatchDetails" => "GetMatchDetails",
			"GetMatchTimeline" => "GetMatchTimeline",
			"GetChampionImage" => "GetChampionImage",
			"GetItem" => "GetItem",
			"GetRealms" => "GetRealms",
			"GetSpells" => "GetSpells",
);

//-------------------------------------------------

$func_name = $_GET['func'];

echo $api->{$func_tbl[$func_name]}();

//-------------------------------------------------

?>