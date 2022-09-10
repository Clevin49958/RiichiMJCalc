using MjCalcApi.Domain.Game.DTO;

namespace MjCalcApi.Domain.Game
{
    public class GameInstance : BaseEntity
    {
        public ICollection<Player> Players { get; set; } = new List<Player>();

        public GameSetting Setting { get; set; } = default!;

        public DateTime EndingTime { get; set; } 

        public ICollection<Record> Records { get; set; } = new List<Record>();
        
        public GameInstance(GameInstanceDTO dto)
        {
            Players = dto.Players.Select(player => new Player(player)).ToList();
            Records = dto.Records.Select(record => new Record(record)).ToList();
            Setting = new GameSetting(dto.Settings);
            EndingTime = DateTime.Parse(dto.EndTime, null, System.Globalization.DateTimeStyles.RoundtripKind);
        }
    }
}
