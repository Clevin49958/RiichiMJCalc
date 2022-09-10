
using MjCalcApi.Domain.Game.DTO;

namespace MjCalcApi.Domain.Game
{
    public class GameSetting:BaseEntity
    {
        public int NumPlayers { get; set; }

        public GameSetting(GameSettingDTO dto)
        {
            NumPlayers = dto.NumPlayers;
        }
    }
}
