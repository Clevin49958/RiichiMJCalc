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

        public GameSettingDTO Settings { get; set; } = default!;

        public DateTime EndingTime { get; set; }

        public ICollection<RecordDTO> Records { get; set; } = new List<RecordDTO>();
    }
}
