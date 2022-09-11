using MjCalcApi.Domain.Game.DTO;

namespace UnitTest
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
            var settingDTO = new GameSettingDTO { NumPlayers = 2 };
            var playersDTO = new PlayerDTO[]
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
            var recordsDTO = new RecordDTO[]
            {
                new RecordDTO
                {
                    Richii=new bool[]{true, false },
                    Info="[{\"fan\":1,\"fu\":30,\"winner\":1,\"dealIn\":0}]",
                    type="Win",
                },
                new RecordDTO
                {
                    Richii=new bool[]{false, false },
                    Info="[]",
                    type="Draw",
                }
            };
        }

        [Test]
        public void Test1()
        {
            Assert.Pass();
        }
    }
}