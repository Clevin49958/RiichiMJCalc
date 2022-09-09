using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Game
{
    internal class Player
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int Score { get; set; }
    }
}
