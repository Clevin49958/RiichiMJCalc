using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.CustomServices;
using MjCalcApi.AppServices.Repository;
using MjCalcApi.Domain.Data;
using MjCalcApi.Domain.Game;
using MjCalcApi.Domain.Game.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace UnitTest
{
    public class UnitTestGameService
    {
        private Repository<GameInstance> gameRepository;
        private MjCalcDbContext dbContext;
        private GameInstanceDTO gameDTO;
        private GameService service;

        [SetUp]
        public void Setup()
        {
            gameDTO = CommonFixtures.GetGameInstanceDTO();

            dbContext = CommonFixtures.GetDbContext();
            gameRepository = new Repository<GameInstance>(dbContext);
            service = new GameService(gameRepository);
        }

        [Test]
        public void TestGetAndAdd()
        {
            service.GetAll().Should().HaveCount(0);

            GameInstance gameInstance = new GameInstance(gameDTO);
            service.Insert(gameInstance);

            var games = service.GetAll().ToArray();
            games.Should().HaveCount(1);
            games[0].Should().NotBeNull();
            GameInstance game = games[0];
            game.Players.Should().HaveCount(2);
            game.Records.Should().HaveCount(2);
        }

        [TearDown]
        public void WipeDatabase()
        {
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
        }
    }
}
