using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MjCalcApi.Domain.Game.DTO
{
    public class GameInstanceDTO
    {
        public ICollection<PlayerDTO> Players { get; set; } = new List<PlayerDTO>();

        public GameSettingDTO Settings { get; set; } = new GameSettingDTO();

        public string EndTime { get; set; } = "1970-01-01T00:00:00.000Z";

        public ICollection<RecordDTO> Records { get; set; } = new List<RecordDTO>();
    }
}
