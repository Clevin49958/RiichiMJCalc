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
            return await _context.Games.ToListAsync();
        }


        // GET: api/game/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameInstance>> GetGame(int id)
        {
            if (_context.Games == null)
            {
                return NotFound();
            }
            var gameInstance = await _context.Games.FindAsync(id);

            if (gameInstance == null)
            {
                return NotFound();
            }

            return gameInstance;
        }
    }
}