using Domain.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model
{
    internal class GameInstance
    {
        public int Id { get; set; }
        public ICollection<Player> Players { get; set; } = new List<Player>();

        public GameSetting Setting { get; set; } = default!;

        public DateTime EndingTime { get; set; }; 

    }
}
