using MjCalcApi.Domain.Game;
using MjCalcApi.Domain.Game.DTO;

namespace UnitTest
{
    public class Tests
    {
        private GameSettingDTO settingDTO;
        private PlayerDTO[] playerDTOs;
        private RecordDTO[] recordDTOs;
        private string endingTimeStr;
        private GameInstanceDTO gameInstanceDTO;
        private GameInstance gameInstance;

        [SetUp]
        public void Setup()
        {
            settingDTO = new GameSettingDTO { NumPlayers = 2 };
            playerDTOs = new PlayerDTO[]
            {
                new PlayerDTO
                {
                    Name="player A",
                    Score=40000,
                },
                new PlayerDTO {
                    Name="Player B",
                    Score=60000,
                }
            };
            recordDTOs = new RecordDTO[]
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
            endingTimeStr = "2022-09-09T08:47:14.000Z";
            gameInstanceDTO = new GameInstanceDTO
            {
                EndTime = endingTimeStr,
                Records = recordDTOs,
                Settings = settingDTO,
                Players = playerDTOs

            };

            gameInstance = new GameInstance(gameInstanceDTO);
        }

        [Test]
        public void TestPlayerDTO()
        {
            var player = new Player(playerDTOs[0]);
            player.Name.Should().Be("player A");
            player.Score.Should().Be(40000);
        }

        [Test]
        public void TestRecordDTO()
        {
            var record = new Record(recordDTOs[0]);
            record.Info.Should().Be("[{\"fan\":1,\"fu\":30,\"winner\":1,\"dealIn\":0}]");
            record.Richii.Should().Be("[false,false]");
            record.EndingType.Should().Be(EndingType.Win);
            // check ending type enum
            record = new Record(recordDTOs[1]);
            record.EndingType.Should().Be(EndingType.Draw);
        }

        [Test]
        public void TestGameInstanceDTO()
        {
            gameInstance.Records.Should().HaveCount(2);
            gameInstance.Records.ToArray()[1].EndingType.Should().Be(EndingType.Draw);

            gameInstance.Players.Should().HaveCount(2);
            gameInstance.Players.ToArray()[1].Score.Should().Be(60000);

            gameInstance.EndingTime.ToUniversalTime()
                .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'")
                .Should().Be("2022-09-09T08:47:14.000Z");
            gameInstance.EndingTime.Hour.Should().Be(8);

            gameInstance.Setting.NumPlayers.Should().Be(2);
            gameInstance.Id.Should().Be(0);
        }
    }
}