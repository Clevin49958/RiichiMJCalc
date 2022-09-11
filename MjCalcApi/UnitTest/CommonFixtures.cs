using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.Repository;
using MjCalcApi.Domain.Data;
using MjCalcApi.Domain.Game;
using MjCalcApi.Domain.Game.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest
{
    public class CommonFixtures
    {
        public static GameInstanceDTO GetGameInstanceDTO()
        {
            #region Prepare DTO
            var settingDTO = new GameSettingDTO { NumPlayers = 2 };
            var playerDTOs = new PlayerDTO[]
            {
                new PlayerDTO
                {
                    Name="player A",
                    Score=40000,
                },
                new PlayerDTO
                {
                    Name = "Player B",
                    Score = 60000,
                }
            };
            var recordDTOs = new RecordDTO[]
            {
                new RecordDTO
                {
                    Richii="[false,false]",
                    Info="[{\"fan\":1,\"fu\":30,\"winner\":1,\"dealIn\":0}]",
                    type="Win",
                },
                new RecordDTO
                {
                    Richii= "[false,true]",
                    Info="[]",
                    type="Draw",
                }
            };
            var endingTimeStr = "2022-09-09T08:47:14.000Z";
            #endregion

            var gameInstanceDTO = new GameInstanceDTO
            {
                EndTime = endingTimeStr,
                Records = recordDTOs,
                Settings = settingDTO,
                Players = playerDTOs

            };
            return gameInstanceDTO;
        }

        public static MjCalcDbContext GetDbContext()
        {
            var optionBuilder = new DbContextOptionsBuilder<MjCalcDbContext>();
            optionBuilder.UseInMemoryDatabase("MjCalc");

            var dbContext = new MjCalcDbContext(optionBuilder.Options);
            return dbContext;
        }

    }
}
