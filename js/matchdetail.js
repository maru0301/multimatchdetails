////////////////////////////////////////////////////////////////////////////////////
// MatchDetail Class
////////////////////////////////////////////////////////////////////////////////////

class MatchDetail
{
	////////////////////////////////////////////////////////////////////////////////////
	// constructor
	////////////////////////////////////////////////////////////////////////////////////
	constructor()
	{
		this.ERROR_ID_VERSION_GET_ERROR 		= "サーバーバージョン情報が取得出来ませんでした";
		this.ERROR_ID_REALM_GET_ERROR 			= "バージョン情報が取得出来ませんでした";
		this.ERROR_ID_CHAMPION_IMG_GET_ERROR 	= "チャンピオンイメージ情報が取得出来ませんでした";
		this.ERROR_ID_SUMMONER_SPELL_GET_ERROR 	= "サモナースペル情報が取得出来ませんでした";
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
		this.JSON_DATA_SPELLS = new Array();
		
		this.TEAM_TAG = ["blue", "red"];

		this.TIMELINE_WORK_DATA = {};
		this.VISION_WARD_ID = new Array();

		this.frame = 0;
		this.isShow = false;
		this.isEndFrame = false;

		this.TEAM_NAME = ["Blue", "Red"];

		this.MATCHLIST = new Array();

		this.TEAM_ID_BLUE = 100;
		this.TEAM_ID_RED = 200;

		this.TryCnt = 0;
		this.TimelineTryCnt = 0;
	}

	CreateMatchListObject(num)
	{
		for(let i = 0 ; i < num ; ++i)
		{
			this.MATCHLIST[i] = {};
			this.MATCHLIST[i].game = {};
			this.MATCHLIST[i].game.gameRealm = "";
			this.MATCHLIST[i].game.gameId = "";
			this.MATCHLIST[i].game.gameHash = "";

			this.MATCHLIST[i].game.gameVer = "";
			this.MATCHLIST[i].cdnVer = "";

			this.MATCHLIST[i].teams = new Array();
			this.MATCHLIST[i].isGetJson = false;

			this.MATCHLIST[i].timeline = new Array();
			this.MATCHLIST[i].isGetTimelineJson = false;
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

		let data = url_data.split("data=")[1];
		data = decodeURIComponent(data);

		// size
		let index = data.search("&");
		let length = data.substr(0, index);
		// MatchListObject作成
		this.CreateMatchListObject(length);

		data = data.substr(index+1);
		for(let i = 0 ; i < length ; ++i)
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
		this.RemakeGame(JsonData);

		let index = JsonData.index;
		// Game
		this.MATCHLIST[index].game.gameVer = JsonData.gameVersion;
		// CDN Ver
		this.MATCHLIST[index].cdnVer = this.GetVersion(this.MATCHLIST[index].game.gameVer, this.VERSIONS);
		// Team
		for(let j = 0 ; j < JsonData.teams.length ; ++j)
		{
			this.MATCHLIST[index].teams[j] = {};
			this.MATCHLIST[index].teams[j].teamId = JsonData.teams[j].teamId;
			this.MATCHLIST[index].teams[j].win = JsonData.teams[j].win == "Win" ? true : false;

			// TeamTag
			for(let k = 0 ; k < JsonData.participants.length ; ++k)
			{
				// TeamIDが同じか
				if(this.MATCHLIST[index].teams[j].teamId == JsonData.participants[k].teamId)
				{
					let participantId = JsonData.participants[k].participantId;
					// プレイヤーの名前を引っ張ってくる
					for(let l = 0 ; l < JsonData.participantIdentities.length ; ++l)
					{
						if(participantId == JsonData.participantIdentities[l].participantId)
						{
							let tag = JsonData.participantIdentities[l].player.summonerName;
							let tagindex = tag.search(" ");
							tag = tag.substr(0, tagindex);

							this.MATCHLIST[index].teams[j].teamTag = tag;
							break;
						}
					}
				}
			}

			// Ban
			this.MATCHLIST[index].teams[j].bans = new Array();
			for(let k = 0 ; k < JsonData.teams[j].bans.length ; ++k)
			{
				this.MATCHLIST[index].teams[j].bans[k] = {};
				this.MATCHLIST[index].teams[j].bans[k].championId = JsonData.teams[j].bans[k].championId;
				this.MATCHLIST[index].teams[j].bans[k].pickTurn = JsonData.teams[j].bans[k].pickTurn;
			}

			// Stats
			this.MATCHLIST[index].teams[j].stats = {};
			this.MATCHLIST[index].teams[j].stats.baronKills = JsonData.teams[j].baronKills;
			this.MATCHLIST[index].teams[j].stats.dragonKills = JsonData.teams[j].dragonKills;
			this.MATCHLIST[index].teams[j].stats.riftHeraldKills = JsonData.teams[j].riftHeraldKills;
			this.MATCHLIST[index].teams[j].stats.towerKills = JsonData.teams[j].towerKills;
			this.MATCHLIST[index].teams[j].stats.inhibitorKills = JsonData.teams[j].inhibitorKills;
		}

		// Player
		for(let j = 0 ; j < this.MATCHLIST[index].teams.length ; ++j)
		{
			let setIndex = 0;
			for(let k = 0 ; k < JsonData.participants.length ; ++k)
			{
				if(this.MATCHLIST[index].teams[j].teamId == JsonData.participants[k].teamId)
				{
					this.CreatePlayerObject(index, j, setIndex);

					this.MATCHLIST[index].teams[j].player[setIndex].championId = JsonData.participants[k].championId;
					this.MATCHLIST[index].teams[j].player[setIndex].participantId = JsonData.participants[k].participantId;
					this.MATCHLIST[index].teams[j].player[setIndex].spells = new Array(JsonData.participants[k].spell1Id, JsonData.participants[k].spell2Id);
					this.MATCHLIST[index].teams[j].player[setIndex].stats = JsonData.participants[k].stats;

					setIndex++;
				}
			}
		}
		
		for(let j = 0 ; j < this.MATCHLIST[index].teams.length ; ++j)
		{
			for(let k = 0 ; k < this.MATCHLIST[index].teams[j].player.length ; ++k)
			{
				for(let l = 0 ; l < JsonData.participantIdentities.length ; ++l)
				{
					if(this.MATCHLIST[index].teams[j].player[k].participantId == JsonData.participantIdentities[l].participantId)
					{
						this.MATCHLIST[index].teams[j].player[k].name = JsonData.participantIdentities[l].player.summonerName;
					}
				}
			}
		}

		this.MATCHLIST[index].isGetJson = true;
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Json
	////////////////////////////////////////////////////////////////////////////////////

	GetMatchDetailJson()
	{
		let self = this;

		if(self.MATCHLIST.length > 1)
		{
			let jqXHRList = [];

			for(let i = 0 ; i < self.MATCHLIST.length ; ++i)
			{
				if(!self.MATCHLIST[i].isGetJson)
				{
					jqXHRList.push($.ajax(
					{
						url: './php/main.php',
						type: 'GET',
						dataType: 'json',
						data: { func:"GetMatchDetails", realm:self.MATCHLIST[i].game.gameRealm, id:self.MATCHLIST[i].game.gameId, hash:self.MATCHLIST[i].game.gameHash, index:i }
					}));
				}
			}
			
			$.when.apply(null, jqXHRList).done(function()
			{
				let json = [];
				let statuses = [];
				let jqXHRResultList = [];
				
				for(let i = 0, max = arguments.length ; i < max ; ++i)
				{
					let result = arguments[i];
					json.push(result[0]);
					statuses.push(result[1]);
					jqXHRResultList.push(result[3]);
				}

				let isRetry = false;
				
				// Jsonパース
				for(let i = 0 ; i < json.length ; ++i)
				{
					if(json[i] !== null)
					{
						self.ParseMatchDetailJson(json[i]);
					}
					else
					{
						// doneだけどJsonデータがnullの時があるので再度リトライする
						isRetry = true;
					}
				}

				if(!isRetry)
					self.GetMatchDetailTimelineJson();
				else
					self.RetryGetMatchDetailJson();
			});
			
			$.when.apply(null, jqXHRList).fail(function()
			{
				console.log("Fail : GetMatchDetailJson");
				console.log(jqXHRList);

				for(let i = 0 ; i < jqXHRList.length ; ++i)
				{
					if(jqXHRList[i].statusText === "error" || jqXHRList[i].responseJSON === undefined)
					{
						if(i !== undefined)
							console.log("Fail index: " + i);
					}
					else
					{
						// 成功した物は保存
						self.ParseMatchDetailJson(jqXHRList[i].responseJSON);
					}
				}

				self.RetryGetMatchDetailJson();
			});
		}
		else
		{
			$.ajax({
				url: './php/main.php',
				type: 'GET',
				dataType: 'json',
				data: { func:"GetMatchDetails", realm:self.MATCHLIST[0].game.gameRealm, id:self.MATCHLIST[0].game.gameId, hash:self.MATCHLIST[0].game.gameHash, index:0 }
			})
			.done(function(data)
			{
				self.ParseMatchDetailJson(data);
				self.GetMatchDetailTimelineJson();
			})
			.fail(function()
			{
				self.RetryGetMatchDetailJson();
			});
		}
	}
	
	InitDataJson(matchDetailData, matchTimelineJson)
	{
		let self = this;

		let request = [
			{ error_id: this.ERROR_ID_CHAMPION_IMG_GET_ERROR,	url: './php/main.php', data: { func:"GetChampionImage" },  },
			{ error_id: this.ERROR_ID_ITEM_IMG_GET_ERROR,		url: './php/main.php', data: { func:"GetItem" },  },
			{ error_id: this.ERROR_ID_REALM_GET_ERROR,			url: './php/main.php', data: { func:"GetRealms" },  },
			{ error_id: this.ERROR_ID_SUMMONER_SPELL_GET_ERROR,	url: './php/main.php', data: { func:"GetSpells" },  },
			{ error_id: this.ERROR_ID_VERSION_GET_ERROR,		url: './php/main.php', data: { func:"GetVersions" },  },
		];

		let jqXHRList = [];

		for(let i = 0, max = request.length ; i < max ; ++i)
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
			let json = [];
			let statuses = [];
			let jqXHRResultList = [];
			
			for(let i = 0, max = arguments.length ; i < max ; ++i)
			{
				let result = arguments[i];
				json.push(result[0]);
				statuses.push(result[1]);
				jqXHRResultList.push(result[3]);
			}

			let championImgJson = json[0];
			let itemImgJson = json[1];
			let realmsJson = json[2];
			let spellsJson = json[3];
			let versionsJson = json[4];

			// Champion
			let championImgData = new Array();
//			var itemImgImgData = new Array();
			
			for(let key in championImgJson.data)
				self.JSON_DATA_CHAMP_IMG.push(championImgJson.data[key]);
			
			// Realms
			self.VERSION = realmsJson.v;

			// Spells
			for(let key in spellsJson.data)
				self.JSON_DATA_SPELLS.push(spellsJson.data[key]);

			// Versions
			self.VERSIONS = versionsJson;

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

			for(let i = 0 ; i < jqXHRList.length ; ++i)
			{
				if(jqXHRList[i].statusText === "error")
				{
					console.log(request[i].error_id);
				}
			}
		});
	}

	GetMatchDetailTimelineJson()
	{
		let self = this;

		if(self.MATCHLIST.length > 1)
		{
			let jqXHRList = [];

			for(let i = 0 ; i < self.MATCHLIST.length ; ++i)
			{
				if(!self.MATCHLIST[i].isGetTimelineJson)
				{
					jqXHRList.push($.ajax(
					{
						url: './php/main.php',
						type: 'GET',
						dataType: 'json',
						data: { func:"GetMatchTimeline", realm:self.MATCHLIST[i].game.gameRealm, id:self.MATCHLIST[i].game.gameId, hash:self.MATCHLIST[i].game.gameHash, index:i }
					}));
				}
			}
			
			$.when.apply(null, jqXHRList).done(function()
			{
				let json = [];
				let statuses = [];
				let jqXHRResultList = [];
				
				for(let i = 0, max = arguments.length ; i < max ; ++i)
				{
					let result = arguments[i];
					json.push(result[0]);
					statuses.push(result[1]);
					jqXHRResultList.push(result[3]);
				}

				let isRetry = false;
				
				// Jsonパース
				for(let i = 0 ; i < json.length ; ++i)
				{
					if(json[i] !== null)
					{
//						self.ParseMatchDetailJson(json[i]);
						self.MATCHLIST[i].isGetTimelineJson = true;
					}
					else
					{
						// doneだけどJsonデータがnullの時があるので再度リトライする
						isRetry = true;
					}
				}

				if(!isRetry)
					view.Init();
				else
					self.RetryGetMatchTimelineJson();
			});
			
			$.when.apply(null, jqXHRList).fail(function()
			{
				console.log("Fail : GetMatchTimelineJson");
				console.log(jqXHRList);

				for(let i = 0 ; i < jqXHRList.length ; ++i)
				{
					if(jqXHRList[i].statusText === "error" || jqXHRList[i].responseJSON === undefined)
					{
						if(i !== undefined)
							console.log("Fail index: " + i);
					}
					else
					{
						// 成功した物は保存
//						self.ParseMatchDetailJson(jqXHRList[i].responseJSON);
						self.MATCHLIST[i].isGetTimelineJson = true;
					}
				}

				self.RetryGetMatchTimelineJson();
			});
		}
		else
		{
			$.ajax({
				url: './php/main.php',
				type: 'GET',
				dataType: 'json',
				data: { func:"GetMatchTimeline", realm:self.MATCHLIST[0].game.gameRealm, id:self.MATCHLIST[0].game.gameId, hash:self.MATCHLIST[0].game.gameHash, index:0 }
			})
			.done(function(data)
			{
				console.log(data);
//				self.ParseMatchDetailJson(data);
				view.Init();
			})
			.fail(function()
			{
				console.log("Fail : GetMatchTimelineJson");
				self.RetryGetMatchTimelineJson();
			});
		}
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
		for(let i = 0 ; i < this.JSON_DATA_CHAMP_IMG.length ; ++i)
		{
			if(id == this.JSON_DATA_CHAMP_IMG[i].id)
				return this.JSON_DATA_CHAMP_IMG[i].image.full;
		}
	}

	GetChampionName(id)
	{
		for(let i = 0 ; i < this.JSON_DATA_CHAMP_IMG.length ; ++i)
		{
			if(id == this.JSON_DATA_CHAMP_IMG[i].id)
				return this.JSON_DATA_CHAMP_IMG[i].name;
		}
	}

	GetSpellImgName(id)
	{
		for(let i = 0 ; i < this.JSON_DATA_SPELLS.length ; ++i)
		{
			if(id == this.JSON_DATA_SPELLS[i].id)
			{
				return this.JSON_DATA_SPELLS[i].image.full;
			}
		}
	}

	GetGoldReplaceKilo(num)
	{		
		let gold = Math.round(num / 100);
		gold /= 10;

		return `${gold}k`;
	}

	GetVersion(ver, json)
	{
		let version = ver;

		if(version == undefined)
			return json[0];

		while(1)
		{
			for(let i = 0 ; i < json.length ; ++i)
			{
				if(version.indexOf(json[i]) !== -1)
					return json[i];
			}

			if(version.length-1 > 0)
			{
				version = version.substr(0, version.length-1);
			}
			else
			{
				version = ver;
				while(1)
				{
					let index = version.search(".");
					let diff = index+2;
					version = version.substr(index+2, version.length);
					index = version.search(".")+1;
					version = ver.substr(0, diff+index);

					for(let i = 0 ; i < json.length ; ++i)
					{
						let jsonVer = json[i];
						index = jsonVer.search(".");
						diff = index+2;
						jsonVer = jsonVer.substr(index+2, jsonVer.length);
						index = jsonVer.search(".")+1;
						jsonVer = json[i].substr(0, diff+index);

						if(version.indexOf(jsonVer) !== -1)
							return json[i];
					}
					
					return json[0];
				}
			}
		}
	}

	////////////////////////////////////////////////////////////////////////////////////

	RetryGetMatchDetailJson()
	{
		if(this.TryCnt < 40)
		{
			let self = this;
			// 何秒か待つ
			setTimeout(function(){
				self.GetMatchDetailJson();
			}, 10000);

			self.TryCnt++;
		}
		else
		{
			console.log("GetMatchDetailJson Try Max Failed");
		}
	}

	RetryGetMatchTimelineJson()
	{
		if(this.TimelineTryCnt < 40)
		{
			let self = this;
			// 何秒か待つ
			setTimeout(function(){
				self.GetMatchDetailTimelineJson();
			}, 10000);

			self.TimelineTryCnt++;
		}
		else
		{
			console.log("GetMatchTimelineJson Try Max Failed");
		}
	}

	////////////////////////////////////////////////////////////////////////////////////

	RemakeGame(Json)
	{
		// LCK
		// Week2 KT vs SKT-T1 Game2 
		if(Json.gameId === 540885 && Json.platformId === "ESPORTSTMNT06")
		{
			// SKT
			Json.teams[0].bans = [ {championId:96, pickTurn:1}, {championId:15, pickTurn:2}, {championId:3, pickTurn:3}, {championId:40, pickTurn:4}, {championId:98, pickTurn:5} ];
			// KT
			Json.teams[1].bans = [ {championId:113, pickTurn:1}, {championId:81, pickTurn:2}, {championId:223, pickTurn:3}, {championId:164, pickTurn:4}, {championId:41, pickTurn:5} ];
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////

const matchdetail = new MatchDetail();
matchdetail.Init(location.href);