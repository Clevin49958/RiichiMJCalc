using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.Repository;
using MjCalcApi.Domain.Data;
using MjCalcApi.Domain.Game;
using MjCalcApi.Domain.Game.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest
{
    public class UnitTestPersistance
    {
        private Repository<GameInstance> gameRepository;
        private MjCalcDbContext dbContext;
        private Repository<Record> recordRepository;
        private Repository<Player> playerRepository;
        private GameInstanceDTO gameDTO;

        [OneTimeSetUp]
        public void Setup()
        {
            gameDTO = CommonFixtures.GetGameInstanceDTO();

            dbContext = CommonFixtures.GetDbContext();
            gameRepository = new Repository<GameInstance>(dbContext);
            recordRepository = new Repository<Record>(dbContext);
            playerRepository = new Repository<Player>(dbContext);
        }

        [Test]
        public void TestGetAndAdd()
        {
            gameRepository.GetAll().Should().HaveCount(0);
            gameRepository.Insert(new GameInstance(gameDTO));
            gameRepository.GetAll().Should().HaveCount(1);
            recordRepository.GetAll().Should().HaveCount(2);
            playerRepository.GetAll().Should().HaveCount(2);

            gameRepository.Get(1).Should().NotBeNull();
            var player = playerRepository.Get(2);
            player.Should().NotBeNull();
            player!.Score.Should().Be(60000);
        }

        [TearDown]
        public void WipeDatabase()
        {
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
        }
    }
}
