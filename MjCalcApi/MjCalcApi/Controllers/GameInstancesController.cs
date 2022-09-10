using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.ICustomServices;
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
        private readonly ICustomService<GameInstance> _customService;
        private readonly MjCalcDbContext _context;

        public GameController(ICustomService<GameInstance> customService, MjCalcDbContext context)
        {
            _context = context;
            _customService = customService;
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
            var gameInstance = new GameInstance(gameInstanceDTO);
            _context.Games.Add(gameInstance);

            await _context.SaveChangesAsync();
            return CreatedAtAction("GetGames", gameInstance);
        }
    }
}