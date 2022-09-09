using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MjCalcApi.Domain.Data;
using MjCalcApi.Domain.Game;
using MjCalcApi.Domain.Game.DTO;
using System.Linq;

namespace MjCalcApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly MjCalcDbContext _context;

        public GameController(MjCalcDbContext context)
        {
            _context = context;
        }

        // GET: api/game
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameInstance>>> GetGames()
        {
            if (_context.Games == null)
            {
                return NotFound();
            }
            return await _context.Games.Include(game => game.Setting).Include(game => game.Players).ToListAsync();
        }


        // GET: api/game/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameInstance>> GetGame(int id)
        {
            if (_context.Games == null)
            {
                return NotFound();
            }
            var gameInstance = await _context.Games
                .Include(game => game.Setting)
                .Include(game => game.Records)
                .Include(game => game.Players)
                .SingleOrDefaultAsync(game => game.Id == id);

            if (gameInstance == null)
            {
                return NotFound();
            }

            return gameInstance;
        }

        // POST: api/game
        [HttpPost]
        public async Task<ActionResult<GameInstance>> PostGameInstance(GameInstanceDTO gameInstanceDTO)
        {
            var players = gameInstanceDTO.Players.Select(player => new Player 
            { 
                Name = player.Name, Score = player.Score 
            }).ToList();

            var records = gameInstanceDTO.Records.Select(record => new Record
            {
                Info = record.Info,
                EndingType = (EndingType)Enum.Parse(typeof(EndingType), record.type),
                Richii = record.Richii,
            }).ToList();

            var setting = new GameSetting { NumPlayers = gameInstanceDTO.Settings.NumPlayers };
            var time = DateTime.Parse(gameInstanceDTO.EndTime, null, System.Globalization.DateTimeStyles.RoundtripKind);
            var gameInstance = new GameInstance
            {
                EndingTime = time,
                Players = players,
                Records = records,
                Setting = setting,
            };
            _context.Games.Add(gameInstance);

            await _context.SaveChangesAsync();
            return CreatedAtAction("GetGames", gameInstance);
        }
    }
}