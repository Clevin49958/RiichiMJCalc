using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MjCalcApi.Domain.Game.DTO
{
    public class RecordDTO
    {
        public bool[] Richii = new bool[4];

        public string type { get; set; }

        public string Info { get; set; } = default!;
    }
}
