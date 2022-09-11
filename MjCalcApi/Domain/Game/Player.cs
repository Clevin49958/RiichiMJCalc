
using MjCalcApi.Domain.Game.DTO;

namespace MjCalcApi.Domain.Game
{
    public class Player: BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public int Score { get; set; }

        public Player() { }
        public Player(PlayerDTO player)
        {
            Name = player.Name;
            Score = player.Score;
        }
    }
}
