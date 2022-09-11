using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MjCalcApi.Domain.Game.DTO
{
    public class RecordDTO
    {
        public string Richii { get; set; } = string.Empty;

        public string type { get; set; } = "Win";

        public string Info { get; set; } = string.Empty;
    }
}
