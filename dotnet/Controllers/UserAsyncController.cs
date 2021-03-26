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
  public class UserAsyncController : ControllerBase
  {
    private readonly LeafPointContext _context;

    public UserAsyncController(LeafPointContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
      return await _context.Users.ToListAsync();
    }
  }
}