////////////////////////////////////////////////////////////////////////////////////
// OverView Class
////////////////////////////////////////////////////////////////////////////////////

class OverView
{
	////////////////////////////////////////////////////////////////////////////////////
	// constructor
	////////////////////////////////////////////////////////////////////////////////////

	constructor()
	{
		this.Data = new Array();
		this.ImgMap = new Map();

		this.BLUE_SCOREBOARD_NAME = "blueScoreBoard";
		this.RED_SCOREBOARD_NAME = "redScoreBoard";
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Init
	////////////////////////////////////////////////////////////////////////////////////

	Init()
	{
		// Init
		this.InitData();
		// Show
		this.ShowMatch(this.Data);
	}

	InitData()
	{
		// Init
		this.InitMatch();
	}

	InitMatch()
	{
		console.log(matchdetail.MATCHLIST);

		let Match = new Array();

		for(let i = 0 ; i < matchdetail.MATCHLIST.length ; ++i)
		{
			Match[i] = {};
			Match[i].teams = new Array();
			Match[i].gameVer = matchdetail.MATCHLIST[i].game.gameVer;

			for(let j = 0 ; j < matchdetail.MATCHLIST[i].teams.length ; ++j)
			{
				Match[i].teams[j] = {};

				Match[i].teams[j].teamId = matchdetail.MATCHLIST[i].teams[j].teamId;
				Match[i].teams[j].teamTag = matchdetail.MATCHLIST[i].teams[j].teamTag;
				Match[i].teams[j].win = matchdetail.MATCHLIST[i].teams[j].win;

				// Stats
				Match[i].teams[j].stats = matchdetail.MATCHLIST[i].teams[j].stats;

				// Player
				Match[i].teams[j].player = matchdetail.MATCHLIST[i].teams[j].player;

				// Bans
				Match[i].teams[j].bans = new Array();

				for(let k = 0 ; k < matchdetail.MATCHLIST[i].teams[j].bans.length ; ++k)
				{
					Match[i].teams[j].bans.push(matchdetail.MATCHLIST[i].teams[j].bans[k]);
				}

				Match[i].teams[j].bans.sort(function(a,b){
					return a.pickTurn < b.pickTurn ? 0 : 1;
				});
			}
		}

		this.Data = Match;
	}

	////////////////////////////////////////////////////////////////////////////////////
	// Show
	////////////////////////////////////////////////////////////////////////////////////

	ShowMatch(CommonData)
	{
		let target = $('.overview')[0];

		for(let i = 0 ; i < CommonData.length ; ++i)
		{
			let newSectionTag = document.createElement("section");
			newSectionTag.className = `match${i+1}` 
			let newHeaderTag = document.createElement("h1");
			let verTag = document.createElement("p");
			verTag.className = `gameversion` 
			verTag.innerHTML = `GameVersion : ${CommonData[i].gameVer}`;
			
			newHeaderTag.innerHTML = `Match${i+1}`;

			newSectionTag.appendChild(newHeaderTag);
			newSectionTag.appendChild(verTag);
			target.appendChild(newSectionTag);

			this.ShowScoreBoard(CommonData[i], newSectionTag.className);	
		}
	}

	ShowScoreBoard(CommonData, TargetMatchClassName)
	{
		let target = $(`.overview .${TargetMatchClassName}`)[0];

		for(let i = 0 ; i < CommonData.teams.length ; ++i)
		{
			let scoreTag = document.createElement("div");
			scoreTag.className = CommonData.teams[i].teamId == 100 ? this.BLUE_SCOREBOARD_NAME : this.RED_SCOREBOARD_NAME;
			target.appendChild(scoreTag);

			this.ShowTeamHeader(CommonData.teams[i], scoreTag, scoreTag.className);
			this.ShowPlayers(CommonData.teams[i], scoreTag, scoreTag.className);
			this.ShowTeamBanObject(CommonData.teams[i], TargetMatchClassName, scoreTag, scoreTag.className);
		}
	}

	ShowTeamHeader(Data, Target, TargetClassName)
	{
		// Header
		let teamHeaderTag = document.createElement("div");
		teamHeaderTag.className = "team-header";
		Target.appendChild(teamHeaderTag);

		Target = teamHeaderTag;

		// TeamName
		let teamTag = document.createElement("div");
		teamTag.className = "teamTag";
		teamTag.innerHTML = Data.teamTag;

		// Win,Lose
		let winTag = document.createElement("div");
		winTag.className = "teamWin";
		winTag.innerHTML = Data.win === true ? "Win" : "Lose";

		// KDA
		let kdaTag = document.createElement("div");
		kdaTag.className = "teamKDA";

		let kills = 0;
		let deaths = 0;
		let assists = 0;
		let gold = 0;

		for(let i = 0 ; i < Data.player.length ; ++i)
		{
			kills += Data.player[i].stats.kills;
			deaths += Data.player[i].stats.deaths;
			assists += Data.player[i].stats.assists;
			gold += Data.player[i].stats.goldEarned;
		}

		kdaTag.innerHTML = `${kills}/${deaths}/${assists}`;

		// Space
		let spaceTag = document.createElement("div");
		spaceTag.className = "teamSpace";

		// Gold
		let goldTag = document.createElement("div");
		goldTag.className = "teamGold";
		goldTag.innerHTML = matchdetail.GetGoldReplaceKilo(gold);

		if(Data.teamId === matchdetail.TEAM_ID_BLUE)
		{
			// Blue
			Target.appendChild(teamTag);
			Target.appendChild(winTag);
			Target.appendChild(kdaTag);
			Target.appendChild(spaceTag);
			Target.appendChild(goldTag);
		}
		else
		{
			// Red
			Target.appendChild(goldTag);
			Target.appendChild(spaceTag);
			Target.appendChild(kdaTag);
			Target.appendChild(winTag);
			Target.appendChild(teamTag);
		}
	}

	ShowPlayers(Data, Target, TargetClassName)
	{
		let playersTag = document.createElement("div");
		playersTag.className = "players";
		
		Target.appendChild(playersTag);

		Target = playersTag;

		for(let i = 0 ; i < Data.player.length ; ++i)
		{
			// Player
			let player = document.createElement("div");
			player.className = "player";
			// Champion
			let champ = document.createElement("div");
			champ.className = "champion";
			// ChampionImg
			let champImg = document.createElement("div");
			champImg.className = "championImg";
			
			let tag = new Array();
			let champ_img = matchdetail.GetChampionImgName(Data.player[i].championId);
			tag.push(`<img src="${matchdetail.CDN_URL}/${matchdetail.VERSION}/img/champion/${champ_img}">`);
			tag.push(`<p>${Data.player[i].stats.champLevel}</p>`);
			
			champImg.innerHTML = tag.join("");
			champ.appendChild(champImg);

			// Spells
			let spells = document.createElement("div");
			spells.className = "spells";
			
			//Spell
			for(let j = 0 ; j < Data.player[i].spells.length ; ++j)
			{
				let spell =  document.createElement("div");
				let spell_img = matchdetail.GetSpellImgName(Data.player[i].spells[j]);
				spell.className = "spell";
				spell.innerHTML = `<img src="${matchdetail.CDN_URL}/${matchdetail.VERSION}/img/spell/${spell_img}">`;

				spells.appendChild(spell);
			}

			// Name
			let playerName = document.createElement("div");
			playerName.className = "playerName";
			playerName.innerHTML = `<p class="Name">${Data.player[i].name}</p>`;

			// KDA
			let kda = document.createElement("div");
			kda.className = "kda";
			kda.innerHTML = `<p>${Data.player[i].stats.kills}/${Data.player[i].stats.deaths}/${Data.player[i].stats.assists}</p>`;

			// Items
			let items = document.createElement("div");
			items.className = "items";

			// Item
			const itemId = [
							Data.player[i].stats.item0, Data.player[i].stats.item1, Data.player[i].stats.item2,
							Data.player[i].stats.item3, Data.player[i].stats.item4, Data.player[i].stats.item5
						];
			
			for(let j = 0 ; j < itemId.length ; ++j)
			{
				let item = document.createElement("div");
				item.className = "item";
				if(itemId[j] !== undefined && itemId[j] !== 0)
					item.innerHTML = `<img src="${matchdetail.CDN_URL}/${matchdetail.VERSION}/img/item/${itemId[j]}.png">`;
				
				items.appendChild(item);
			}

			// Trinket
			let trinket = document.createElement("div");
			trinket.className = "trinket";
			// TrinketItem
			let trinketItem = document.createElement("div");
			trinketItem.className = "trinketItem";
			const trinketItemId = Data.player[i].stats.item6;
			if(trinketItemId !== undefined && trinketItemId !== 0)
				trinketItem.innerHTML = `<img src="${matchdetail.CDN_URL}/${matchdetail.VERSION}/img/item/${trinketItemId}.png">`;
			trinket.appendChild(trinketItem);

			// CS
			let cs = document.createElement("div");
			cs.className = "cs";
			cs.innerHTML = `<p>${Data.player[i].stats.totalMinionsKilled}</p>`;

			// Gold
			let gold = document.createElement("div");
			gold.className = "gold";
			gold.innerHTML = `<p>${matchdetail.GetGoldReplaceKilo(Data.player[i].stats.goldEarned)}</p>`;

			if(Data.teamId === matchdetail.TEAM_ID_BLUE)
			{
				// Blue
				player.appendChild(champ);
				player.appendChild(spells);
				player.appendChild(playerName);
				player.appendChild(kda);
				player.appendChild(items);
				player.appendChild(trinket);
				player.appendChild(cs);
				player.appendChild(gold);
			}
			else
			{
				// Red
				player.appendChild(gold);
				player.appendChild(cs);
				player.appendChild(items);
				player.appendChild(trinket);
				player.appendChild(kda);
				player.appendChild(playerName);
				player.appendChild(champ);
				player.appendChild(spells);
			}
			
			Target.appendChild(player);
		}
	}

	ShowTeamBanObject(Data, TargetMatchClassName, TargetSide, TargetSideClassName)
	{
		let teamBanObjectTag = document.createElement("div");
		teamBanObjectTag.className = "team-ban-object";
		
		TargetSide.appendChild(teamBanObjectTag);

		let Target = teamBanObjectTag;

		// Bans
		let bans = document.createElement("div");
		bans.className = "bans";

		// BanTxt
		let bansTxt = document.createElement("p");
		bansTxt.className = "bans_txt";
		bansTxt.innerHTML = `Bans&nbsp;:&nbsp`;
		bans.appendChild(bansTxt);
		
		// BanImg
		let bansImg = document.createElement("div");
		bansImg.className = "bans_img";

		for(let i = 0 ; i < Data.bans.length ; ++i)
		{
			const champImgName = matchdetail.GetChampionImgName(Data.bans[i].championId);
			let img = document.createElement("p");
			img.className = "center_img";
			img.innerHTML = `<img src="${matchdetail.CDN_URL}/${matchdetail.VERSION}/img/champion/${champImgName}">`;
			bansImg.appendChild(img);
		}

		bans.appendChild(bansImg);

		// Object
		let objectTag = document.createElement("div");
		objectTag.className = "object";

		const objContentsDataTbl = [
						[ "turret",		Data.stats.towerKills 		],
						[ "inhibitor",	Data.stats.inhibitorKills	],
						[ "baron",		Data.stats.baronKills		],
						[ "dragon",		Data.stats.dragonKills		],
						[ "riftherald",	Data.stats.riftHeraldKills	]
					];

		// ObjectContents
		let objectContents = document.createElement("div");
		objectContents.className = "object_contents";

		if(Data.teamId === matchdetail.TEAM_ID_RED)
		{
			let objectTxt = document.createElement("p");
			objectTxt.className = "objectSpace";
			objectContents.appendChild(objectTxt);
		}

		for(let i = 0 ; i < objContentsDataTbl.length ; ++i)
		{
			let index = 0;
			if(Data.teamId === matchdetail.TEAM_ID_BLUE)
			{
				// Blue
				index = i;
			}
			else
			{
				// Red
				index = objContentsDataTbl.length-i-1;
			}

			// CenterImg
			let centerImg = document.createElement("p");
			centerImg.className = "center_img";
			centerImg.innerHTML = `<canvas class="object_canvas" id="object_${objContentsDataTbl[index][0]}s_canvas"></canvas>`;

			// ObjectTxt
			let objectTxt = document.createElement("p");
			objectTxt.className = "object_txt";
			objectTxt.innerHTML = objContentsDataTbl[index][1];

			objectContents.appendChild(centerImg);
			objectContents.appendChild(objectTxt);
		}

		objectTag.appendChild(objectContents);

		if(Data.teamId === matchdetail.TEAM_ID_BLUE)
		{
			// Blue
			Target.appendChild(bans);
			Target.appendChild(objectTag);
		}
		else
		{
			// Red
			Target.appendChild(objectTag);
			Target.appendChild(bans);
		}

		for(let i = 0 ; i < objContentsDataTbl.length ; ++i)
		{
			this.DisplayImage(TargetMatchClassName, TargetSideClassName, `object_${objContentsDataTbl[i][0]}s_canvas`, `./data/img/${objContentsDataTbl[i][0]}.png`);
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	// Canvas
	////////////////////////////////////////////////////////////////////////////////////

	DisplayImage(TargetMatchClassName, SideClassName, IdName, ImgSrc)
	{
		const picWidth = 34;
		const picHeight = 34;
		const picLength = picWidth * picHeight;

		let target = $(`.${TargetMatchClassName} .${SideClassName} #${IdName}`)[0];
		
		target.width = picWidth;
		target.height = picHeight;
		
		if (target.getContext)
		{
			const imgMapName =`${TargetMatchClassName}_${SideClassName}_${IdName}`;
			this.ImgMap.set(imgMapName, new Image());

			let ctx = target.getContext("2d");
			let img = this.ImgMap.get(imgMapName);

			img.src = ImgSrc;

			let self = this;
			
			img.onload = function()
			{				
				ctx.drawImage(this, 0, 0, picWidth, picHeight);

				let img = ctx.getImageData(0, 0, picWidth, picHeight);

				for (let i = 0; i < picLength * 4 ; i += 4)
				{
					if(img.data[i+3] != 0 && img.data[i] > 10)
					{
						if(SideClassName === self.RED_SCOREBOARD_NAME)
						{
							// Red
							img.data[i] = 255;
							img.data[i+1] = 0;
							img.data[i+2] = 0;
						}
						else
						{
							// Blue
							img.data[i] = 0;
							img.data[i+1] = 0;
							img.data[i+2] = 255;
						}
					}
				}

				ctx.putImageData(img, 0, 0);
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////

const overview = new OverView();
