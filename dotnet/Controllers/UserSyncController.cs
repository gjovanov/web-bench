using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using dotnet.Data;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserSyncController : ControllerBase
  {
    private readonly LeafPointContext _context;

    public UserSyncController(LeafPointContext context)
    {
      _context = context;
    }

    [HttpGet]
    public IEnumerable<User> GetUsers()
    {
      return _context.Users.ToList();
    }
  }
}