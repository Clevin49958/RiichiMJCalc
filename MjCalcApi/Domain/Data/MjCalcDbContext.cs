using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MjCalcApi.Domain.Game;

namespace MjCalcApi.Domain.Data
{
    public class MjCalcDbContext:DbContext
    {
        public MjCalcDbContext(DbContextOptions<MjCalcDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public DbSet<GameInstance> Games { get; set; }
        public DbSet<GameSetting> GameSettings { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Record> Record { get; set; }

    }
}
