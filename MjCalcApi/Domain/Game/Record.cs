
namespace MjCalcApi.Domain.Game
{
    public class Record
    {
        public int Id { get; set; }

        public bool[] Richii = new bool[4];

        public EndingType EndingType { get; set; }

        public string Info { get; set; } = default!;
    }
}
