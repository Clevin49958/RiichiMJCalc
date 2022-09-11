
using MjCalcApi.Domain.Game.DTO;
using System.ComponentModel.DataAnnotations;

namespace MjCalcApi.Domain.Game
{
    public class Record : BaseEntity
    {
        public string Richii { get; set; } = string.Empty;

        public EndingType EndingType { get; set; }

        public string Info { get; set; } = string.Empty;

        public Record() { }

        public Record (RecordDTO dto)
        {
            Richii = dto.Richii;
            Info = dto.Info;
            EndingType = (EndingType)Enum.Parse(typeof(EndingType), dto.type);
        }
    }
}
