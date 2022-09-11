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

        public GameController(ICustomService<GameInstance> customService)
        {
            _customService = customService;
        }

        // GET: api/game
        [HttpGet]
        public ActionResult<IEnumerable<GameInstance>> GetGames()
        {
            var list = _customService.GetAll().ToList();
            if (list.Count == 0)
            {
                return NotFound();
            }
            return list;
        }


        // GET: api/game/5
        [HttpGet("{id}")]
        public ActionResult<GameInstance> GetGame(int id)
        {
            var game = _customService.Get(id);
            if (game == null)
            {
                return NotFound();
            }
            return Ok(game);
        }

        // POST: api/game
        [HttpPost]
        public ActionResult<GameInstance> PostGameInstance(GameInstanceDTO gameInstanceDTO)
        {
            var gameInstance = new GameInstance(gameInstanceDTO);
            _customService.Insert(gameInstance);
            return CreatedAtAction("GetGames", gameInstance);
        }
    }
}