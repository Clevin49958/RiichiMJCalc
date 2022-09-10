
using MjCalcApi.Domain.Game.DTO;

namespace MjCalcApi.Domain.Game
{
    public class Player: BaseEntity
    {
        public string Name { get; set; } = default!;
        public int Score { get; set; }

        public Player(PlayerDTO player)
        {
            Name = player.Name;
            Score = player.Score;
        }
    }
}
