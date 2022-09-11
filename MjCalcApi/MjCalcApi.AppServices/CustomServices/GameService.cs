using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.ICustomServices;
using MjCalcApi.AppServices.IRepository;
using MjCalcApi.Domain.Game;
using MjCalcApi.Domain.Game.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MjCalcApi.AppServices.CustomServices
{
    public class GameService: ICustomService<GameInstance>
    {
        private readonly IRepository<GameInstance> _Repository;

        public GameService(IRepository<GameInstance> repository)
        {
            _Repository = repository;
        }

        public void Delete(GameInstance entity)
        {
            try
            {
                if (entity != null)
                {
                    _Repository.Delete(entity);
                    _Repository.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public GameInstance? Get(int Id)
        {
            try
            {
                var obj = _Repository.GetDb()
                .Include(game => game.Setting)
                .Include(game => game.Records)
                .Include(game => game.Players)
				.SingleOrDefault(game => game.Id == Id);
                if (obj != null)
                {
                    return obj;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public IEnumerable<GameInstance> GetAll()
        {
            try
            {
                GameInstance[] obj = _Repository.GetDb()
                    .Include(game => game.Setting)
                    .Include(game => game.Players)
                    .ToArray();
                if (obj != null)
                {
                    return obj;
                }
                else
                {
                    return Array.Empty<GameInstance>();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Insert(GameInstance entity)
        {
            try
            {
                if (entity != null)
                {
                    _Repository.Insert(entity);
                    _Repository.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        public void Insert(GameInstanceDTO entity)
        {
            try
            {
                if (entity != null)
                {
                    _Repository.Insert(new GameInstance(entity));
                    _Repository.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Remove(GameInstance entity)
        {
            try
            {
                if (entity != null)
                {
                    _Repository.Remove(entity);
                    _Repository.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Update(GameInstance entity)
        {
            try
            {
                if (entity != null)
                {
                    _Repository.Update(entity);
                    _Repository.SaveChanges();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
