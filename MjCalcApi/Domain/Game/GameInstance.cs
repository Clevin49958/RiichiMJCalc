namespace MjCalcApi.Domain.Game
{
    public class GameInstance
    {
        public int Id { get; set; }
        public ICollection<Player> Players { get; set; } = new List<Player>();

        public GameSetting Setting { get; set; } = default!;

        public DateTime EndingTime { get; set; } 

        public ICollection<Record> Records { get; set; } = new List<Record>();

    }
}
