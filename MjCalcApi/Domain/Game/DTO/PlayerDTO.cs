using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MjCalcApi.Domain.Game.DTO
{
    public class PlayerDTO
    {
        public string Name { get; set; } = default!;
        public int Score { get; set; }
    }
}
