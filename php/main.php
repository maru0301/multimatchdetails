<?php

if( !isset( $_GET['func'] ) ) return;

//-------------------------------------------------

class RiotApi
{
	public function GetMatchDetails()
	{
		$gameRealm = $_GET['realm'];
		$gameId = $_GET['id'];
		$gameHash = $_GET['hash'];

		$url = "https://acs.leagueoflegends.com/v1/stats/game/" . $gameRealm . "/" . $gameId . "?gameHash=" . $gameHash;
/*
		$json = file_get_contents($url);
		$json = json_decode($json, true);
		$index = array('index' => intval($_GET['index']));
		$json = array_merge($json, $index);
*/

		$ctx = stream_context_create(array(
			'http' => array(
			'method' => 'GET',
			'header' => 'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko')
			)
		);
		$json = file_get_contents($url, false, $ctx);
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

		$ctx = stream_context_create(array(
			'http' => array(
			'method' => 'GET',
			'header' => 'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko')
			)
		);
		
		$json = file_get_contents($url, false, $ctx);
		$json = json_decode($json, true);
		$index = array('index' => intval($_GET['index']));
		$json = array_merge($json, $index);
		
		return json_encode($json);
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

	public function GetVersions()
	{
		$json = file_get_contents('../data/json/versions.json');
		
		return $json;
	}

	public function GetRuneforged()
	{
		$json = file_get_contents('../data/json/runesReforged.json');
		
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
			"GetVersions" => "GetVersions",
			"GetRuneforged" => "GetRuneforged",
);

//-------------------------------------------------

$func_name = $_GET['func'];

echo $api->{$func_tbl[$func_name]}();

//-------------------------------------------------

?>