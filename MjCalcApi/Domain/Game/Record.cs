using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Game
{
    internal class Record
    {
        public int Id { get; set; }

        public bool[] Richii = new bool[4];

        public EndingType EndingType { get; set; }

        public string Info { get; set; } = default!;
    }
}
