////////////////////////////////////////////////////////////////////////////////////
// MatchDetail Class
////////////////////////////////////////////////////////////////////////////////////

class MatchDetail {

	constructor()
	{
		this.ERROR_ID_VERSION_GET_ERROR 		= "サーバーバージョン情報が取得出来ませんでした";
		this.ERROR_ID_REALM_GET_ERROR 			= "バージョン情報が取得出来ませんでした";
		this.ERROR_ID_CHAMPION_IMG_GET_ERROR 	= "チャンピオンイメージ情報が取得出来ませんでした";
		this.ERROR_ID_SUMMONER_SPELL_GET_ERROR 	= "チーム情報が取得出来ませんでした";
		this.ERROR_ID_ITEM_IMG_GET_ERROR 		= "アイテムイメージ情報が取得出来ませんでした";
		this.ERROR_ID_TEAM_GET_ERROR 			= "チーム情報が取得出来ませんでした";
		this.ERROR_ID_MASTERY_IMG_GET_ERROR 	= "マスタリーイメージ情報が取得出来ませんでした";
		this.ERROR_ID_MATCH_DETAILS_GET_ERROR	= "試合情報が取得出来ませんでした";
		this.ERROR_ID_MATCH_TIMELINE_GET_ERROR	= "タイムライン情報が取得出来ませんでした";

		this.CDN_URL = "http://ddragon.leagueoflegends.com/cdn";
		this.VERSION = "";

		this.JSON_DATA_MATCHDETAIL = {};
		this.JSON_DATA_TIMELINE = {};
		this.JSON_DATA_CHAMP_IMG = new Array();
		this.JSON_DATA_ITEM_IMG = new Array();

		this.TEAM_TAG = [ "blue", "red" ];

		this.TIMELINE_WORK_DATA = {};
		this.VISION_WARD_ID = new Array();

		this.frame = 0;
		this.isShow = false;
		this.isEndFrame = false;

		this.TEAM_NAME = [ "Blue", "Red" ];

		this.MATCHLIST = new Array();
	}

	CreateMatchListObject(num)
	{
		for(var i = 0 ; i < num ; ++i)
		{
			this.MATCHLIST[i] = {};
			this.MATCHLIST[i].game = {};
			this.MATCHLIST[i].game.gameRealm = "";
			this.MATCHLIST[i].game.gameId = "";
			this.MATCHLIST[i].game.gameHash = "";

			this.MATCHLIST[i].game.gameVer = "";

			this.MATCHLIST[i].teams = new Array();
		}
	}
	
	CreatePlayerObject(matchIndex, teamIndex, index)
	{
		if(this.MATCHLIST[matchIndex].teams[teamIndex].player == undefined)
			this.MATCHLIST[matchIndex].teams[teamIndex].player = new Array();
		
		this.MATCHLIST[matchIndex].teams[teamIndex].player[index] = {};
		
		this.MATCHLIST[matchIndex].teams[teamIndex].player[index].championId = 0;
		this.MATCHLIST[matchIndex].teams[teamIndex].player[index].participantId = 0;
		this.MATCHLIST[matchIndex].teams[teamIndex].player[index].name = "";
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Parser
	////////////////////////////////////////////////////////////////////////////////////

	ParseURLData(url_data)
	{
		console.log(decodeURIComponent(url_data));

		var data = url_data.split("data=")[1];
		data = decodeURIComponent(data);

		// size
		var index = data.search("&");
		var length = data.substr(0, index);
		// MatchListObject作成
		this.CreateMatchListObject(length);

		data = data.substr(index+1);
		for(var i = 0 ; i < length ; ++i)
		{
			// GameRealm取得
			index = data.search(",");
			this.MATCHLIST[i].game.gameRealm = data.substr(0, index);
			data = data.substr(index+1);
			// GameId取得
			index = data.search(",");
			this.MATCHLIST[i].game.gameId = data.substr(0, index);
			data = data.substr(index+1);
			// GameHash取得
			if(i < length -1)
				index = data.search("&");
			else
				index = data.length;
						
			this.MATCHLIST[i].game.gameHash = data.substr(0, index);
			data = data.substr(index+1);
		}
	}

	ParseMatchDetailJson(JsonData)
	{
		for(var i = 0 ; i < JsonData.length ; ++i)
		{
			// Game
			this.MATCHLIST[i].game.gameVer = JsonData[i].gameVersion;

			// Team
			for(var j = 0 ; j < JsonData[i].teams.length ; ++j)
			{
				this.MATCHLIST[i].teams[j] = {};
				this.MATCHLIST[i].teams[j].teamId = JsonData[i].teams[j].teamId;

				// TeamTag
				for(var k = 0 ; k < JsonData[i].participants.length ; ++k)
				{
					// TeamIDが同じか
					if(this.MATCHLIST[i].teams[j].teamId == JsonData[i].participants[k].teamId)
					{
						var participantId = JsonData[i].participants[k].participantId;
						// プレイヤーの名前を引っ張ってくる
						for(var l = 0 ; l < JsonData[i].participantIdentities.length ; ++l)
						{
							if(participantId == JsonData[i].participantIdentities[l].participantId)
							{
								var tag = JsonData[i].participantIdentities[l].player.summonerName;
								var index = tag.search(" ");
								tag = tag.substr(0, index);

								this.MATCHLIST[i].teams[j].teamTag = tag;
								break;
							}
						}
					}
				}

				// Ban
				this.MATCHLIST[i].teams[j].bans = new Array();
				for(var k = 0 ; k < JsonData[i].teams[j].bans.length ; ++k)
				{
					this.MATCHLIST[i].teams[j].bans[k] = {};
					this.MATCHLIST[i].teams[j].bans[k].championId = JsonData[i].teams[j].bans[k].championId;
					this.MATCHLIST[i].teams[j].bans[k].pickTurn = JsonData[i].teams[j].bans[k].pickTurn;
				}
			}

			// Player
			for(var j = 0 ; j < this.MATCHLIST[i].teams.length ; ++j)
			{
				var setIndex = 0;
				for(var k = 0 ; k < JsonData[i].participants.length ; ++k)
				{
					if(this.MATCHLIST[i].teams[j].teamId == JsonData[i].participants[k].teamId)
					{
						this.CreatePlayerObject(i, j, setIndex);

						this.MATCHLIST[i].teams[j].player[setIndex].championId = JsonData[i].participants[k].championId;
						this.MATCHLIST[i].teams[j].player[setIndex].participantId = JsonData[i].participants[k].participantId;

						setIndex++;
					}
				}
			}
			
			for(var j = 0 ; j < this.MATCHLIST[i].teams.length ; ++j)
			{
				for(var k = 0 ; k < this.MATCHLIST[i].teams[j].player.length ; ++k)
				{
					for(var l = 0 ; l < JsonData[i].participantIdentities.length ; ++l)
					{
						if(this.MATCHLIST[i].teams[j].player[k].participantId == JsonData[i].participantIdentities[l].participantId)
						{
							this.MATCHLIST[i].teams[j].player[k].name = JsonData[i].participantIdentities[l].player.summonerName;
						}
					}
				}
			}
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Json
	////////////////////////////////////////////////////////////////////////////////////

	GetMatchDetailJson()
	{
		var self = this;
		var jqXHRList = [];

		for(var i = 0 ; i < this.MATCHLIST.length ; ++i)
		{
			jqXHRList.push($.ajax(
			{
				url: './php/main.php',
				type: 'GET',
				dataType: 'json',
				data: { func:"GetMatchDetails", realm:this.MATCHLIST[i].game.gameRealm, id:this.MATCHLIST[i].game.gameId, hash:this.MATCHLIST[i].game.gameHash }
			}));
		}
		
		$.when.apply(null, jqXHRList).done(function ()
		{
			var json = [];
			var statuses = [];
			var jqXHRResultList = [];
			
			for( var i = 0, max = arguments.length ; i < max ; ++i )
			{
				var result = arguments[i];
				json.push(result[0]);
				statuses.push(result[1]);
				jqXHRResultList.push(result[3]);
			}
			
			// Jsonパース
			self.ParseMatchDetailJson(json);

			view.Init();
		});
		
		$.when.apply(null, jqXHRList).fail(function ()
		{
			console.log("Fail : GetMatchDetailJson");
			console.log(jqXHRList);

			for( var i = 0 ; i < jqXHRList.length ; ++i )
			{
				if( jqXHRList[i].statusText === "error" )
				{
					console.log(request[i].error_id);
				}
			}

		});
	}
	
	InitDataJson(matchDetailData, matchTimelineJson)
	{
		var self = this;

		var request = [
			{ error_id: this.ERROR_ID_CHAMPION_IMG_GET_ERROR,	url: './php/main.php', data: { func:"GetChampionImage" },  },
			{ error_id: this.ERROR_ID_ITEM_IMG_GET_ERROR,		url: './php/main.php', data: { func:"GetItem" },  },
			{ error_id: this.ERROR_ID_REALM_GET_ERROR,			url: './php/main.php', data: { func:"GetRealms" },  },
		];

		var jqXHRList = [];

		for( var i = 0, max = request.length ; i < max ; ++i )
		{
			jqXHRList.push($.ajax(
			{
				url: request[i].url,
				type: 'GET',
				dataType: 'json',
				data: request[i].data,
			}));
		}

		$.when.apply(null, jqXHRList).done(function ()
		{
			var json = [];
			var statuses = [];
			var jqXHRResultList = [];
			
			for( var i = 0, max = arguments.length ; i < max ; ++i )
			{
				var result = arguments[i];
				json.push(result[0]);
				statuses.push(result[1]);
				jqXHRResultList.push(result[3]);
			}

			var championImgJson = json[0];
			var itemImgJson = json[1];
			var realmsJson = json[2];

			// Champion
			var championImgData = new Array();
//			var itemImgImgData = new Array();
			
			for(var key in championImgJson.data)
				self.JSON_DATA_CHAMP_IMG.push(championImgJson.data[key]);
			
			// Realms
			self.VERSION = realmsJson.v;

			// Item
			//for(var key in itemImgJson.data)
			//	itemImgImgData[key] = itemImgJson.data[key];

			// ソート
			// Champion
			self.JSON_DATA_CHAMP_IMG.sort(function(a, b)
			{
					if(a.key < b.key) return -1;
					if(a.key > b.key) return 1;
					if(a.key == b.key) return 0;
			});
/*
			var isSet = false;
			for(var key in itemImgImgData )
			{
				if( !itemImgImgData[key].name )
					continue;
				
				if(itemImgImgData[key].name.indexOf("ward") != -1 || itemImgImgData[key].name.indexOf("Ward") != -1 )
				{
					isSet = false;
					if( itemImgImgData[key].name.indexOf("vision") != -1 || itemImgImgData[key].name.indexOf("Vision") != -1 )
						isSet = true;
					if( itemImgImgData[key].name.indexOf("control") != -1 || itemImgImgData[key].name.indexOf("Control") != -1 )
						isSet = true;

					if(isSet)
						self.VISION_WARD_ID.push(itemImgImgData[key].id);
				}
			}
*/
			self.GetMatchDetailJson();
		});

		$.when.apply(null, jqXHRList).fail(function ()
		{
			console.log("Fail : InitTimeLine");
			console.log(jqXHRList);

			for( var i = 0 ; i < jqXHRList.length ; ++i )
			{
				if( jqXHRList[i].statusText === "error" )
				{
					console.log(request[i].error_id);
				}
			}
		});
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Init
	////////////////////////////////////////////////////////////////////////////////////

	Init(href_url)
	{

		this.ParseURLData(href_url);

		this.InitDataJson();
	}


	////////////////////////////////////////////////////////////////////////////////////

	GetChampionImgName(id)
	{
		for( var i = 0 ; i < this.JSON_DATA_CHAMP_IMG.length ; ++i )
		{
			if ( id == this.JSON_DATA_CHAMP_IMG[i].id )
				return this.JSON_DATA_CHAMP_IMG[i].image.full;
		}
	}

	GetChampionName(id)
	{
		for( var i = 0 ; i < this.JSON_DATA_CHAMP_IMG.length ; ++i )
		{
			if ( id == this.JSON_DATA_CHAMP_IMG[i].id )
				return this.JSON_DATA_CHAMP_IMG[i].name;
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////

var matchdetail = new MatchDetail();
matchdetail.Init(location.href);