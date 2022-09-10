
using MjCalcApi.Domain.Game.DTO;
using System.ComponentModel.DataAnnotations;

namespace MjCalcApi.Domain.Game
{
    public class Record : BaseEntity
    {
        public bool[] Richii = new bool[4];

        public EndingType EndingType { get; set; }

        public string Info { get; set; } = default!;

        public Record (RecordDTO dto)
        {
            Richii = dto.Richii;
            Info = dto.Info;
            EndingType = (EndingType)Enum.Parse(typeof(EndingType), dto.type);
        }
    }
}
